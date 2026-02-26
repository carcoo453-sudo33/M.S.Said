import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('auth_token');
    
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token expired or invalid - clear it and redirect to login
                localStorage.removeItem('auth_token');
                console.warn('Authentication token expired. Please log in again.');
                
                // Only redirect to login if we're not already there
                if (!window.location.pathname.includes('/login')) {
                    router.navigate(['/login'], { 
                        queryParams: { returnUrl: window.location.pathname }
                    });
                }
            }
            return throwError(() => error);
        })
    );
};
