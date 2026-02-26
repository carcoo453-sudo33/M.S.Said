import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponse } from '../models';
import { environment } from '../../environments/environment';
import { SignalRService } from './signalr.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private signalRService = inject(SignalRService);
    private baseUrl = (environment as any).apiBaseUrl || environment.apiUrl.replace('/api', '');

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    login(credentials: { email: string, password: string }) {
        return this.http.post<AuthResponse>(`${this.baseUrl}/identity/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('auth_token', response.accessToken);
                this.currentUserSubject.next(response);
                // Reconnect SignalR with the new token
                this.signalRService.reconnectWithAuth();
            })
        );
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.currentUserSubject.next(null);
        // Reconnect SignalR without token
        this.signalRService.reconnectWithAuth();
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }

    isLoggedIn() {
        return !!this.getToken();
    }
}
