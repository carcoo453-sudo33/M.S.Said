import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    
    // Skip auth for public endpoints
    const publicEndpoints = ['/identity/login', '/identity/register', '/identity/refresh'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
    
    if (!isPublicEndpoint) {
        const token = authService.getToken();
        if (token) {
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
                // Try to refresh token first
                const refreshToken = authService.getRefreshToken();
                if (refreshToken && !req.url.includes('/identity/refresh')) {
                    return authService.refreshToken().pipe(
                        switchMap(() => {
                            // Retry original request with new token
                            const newToken = authService.getToken();
                            if (newToken) {
                                const retryReq = req.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${newToken}`
                                    }
                                });
                                return next(retryReq);
                            }
                            return throwError(() => error);
                        }),
                        catchError(() => {
                            // Refresh failed, redirect to login
                            authService.logout();
                            if (!window.location.pathname.includes('/login')) {
                                router.navigate(['/login'], { 
                                    queryParams: { returnUrl: window.location.pathname }
                                });
                            }
                            return throwError(() => error);
                        })
                    );
                } else {
                    // No refresh token or already trying to refresh, logout
                    authService.logout();
                    if (!window.location.pathname.includes('/login')) {
                        router.navigate(['/login'], { 
                            queryParams: { returnUrl: window.location.pathname }
                        });
                    }
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
