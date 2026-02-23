import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl.replace('/api', '');

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    login(credentials: { email: string, password: string }) {
        return this.http.post<AuthResponse>(`${this.baseUrl}/identity/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.accessToken);
                this.currentUserSubject.next(response);
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!this.getToken();
    }
}
