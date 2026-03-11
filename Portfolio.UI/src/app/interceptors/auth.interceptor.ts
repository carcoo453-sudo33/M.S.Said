import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    
    // Skip auth for public endpoints
    const publicEndpoints = ['/api/Auth/login', '/api/projects', '/api/bio'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
    
    if (!isPublicEndpoint) {
        const token = authService.getToken();
        if (token) {
            // Check if token is about to expire (within 5 minutes)
            if (authService.isTokenExpiringSoon(token)) {
                // Token is expiring soon, logout and redirect to login
                authService.logout();
                if (!window.location.pathname.includes('/login')) {
                    router.navigate(['/login'], { 
                        queryParams: { returnUrl: window.location.pathname }
                    });
                }
                return throwError(() => new Error('Session expired. Please log in again.'));
            }
            
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    }
    
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !isPublicEndpoint) {
                // Logout and redirect to login
                authService.logout();
                if (!window.location.pathname.includes('/login')) {
                    router.navigate(['/login'], { 
                        queryParams: { returnUrl: window.location.pathname }
                    });
                }
            }
            
            // Handle other HTTP errors
            if (error.status === 403) {
                console.warn('Access forbidden. Insufficient permissions.');
            } else if (error.status >= 500) {
                console.error('Server error occurred:', error.message);
            }
            
            return throwError(() => error);
        })
    );
};
