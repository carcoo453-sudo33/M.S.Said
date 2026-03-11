import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { AuthResponse } from '../models';
import { environment } from '../../environments/environment';
import { SignalRService } from './signalr.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private signalRService = inject(SignalRService);
    private baseUrl = environment.apiUrl;

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private readonly TOKEN_KEY = 'auth_token';

    constructor() {
        // Check for existing token on service initialization
        this.checkExistingAuth();
    }

    private checkExistingAuth() {
        const token = this.getToken();
        if (token && !this.isTokenExpired(token)) {
            // Token exists and is valid, set user as authenticated
            this.currentUserSubject.next({ token });
        } else if (token) {
            // Token exists but is expired, clear it
            this.logout();
        }
    }

    login(credentials: { email: string, password: string }) {
        // Input validation
        if (!credentials.email || !credentials.password) {
            return throwError(() => new Error('Email and password are required'));
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
            return throwError(() => new Error('Invalid email format'));
        }

        return this.http.post<AuthResponse>(`${this.baseUrl}/Auth/login`, credentials).pipe(
            tap(response => {
                if (response.success && response.token) {
                    // Store token securely
                    localStorage.setItem(this.TOKEN_KEY, response.token);
                    this.currentUserSubject.next(response);
                    
                    // Reconnect SignalR with the new token
                    this.signalRService.reconnectWithAuth();
                }
            }),
            catchError(error => {
                console.error('Login failed:', error);
                return throwError(() => error);
            })
        );
    }

    logout() {
        // Clear tokens
        localStorage.removeItem(this.TOKEN_KEY);
        
        // Clear user state
        this.currentUserSubject.next(null);
        
        // Reconnect SignalR without token
        this.signalRService.reconnectWithAuth();
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    private isTokenExpired(token: string): boolean {
        try {
            // Check if token is a valid JWT before parsing
            if (!token.includes('.')) return true;
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true; // Treat invalid tokens as expired
        }
    }
}
