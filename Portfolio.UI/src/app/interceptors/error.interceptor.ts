import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { handleGenericError, handleConnectionError } from '../utils/error-handler.util';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const toast = inject(ToastService);
    const auth = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const skipToast = req.url.includes('/api/notifications') || 
                             req.url.includes('/api/signalr') ||
                             req.url.includes('/import-from-url') ||
                             (error.status === 404 && req.url.includes('/optional'));

            if (!skipToast) {
                if (error.status === 0) {
                    // Connection error - special handling
                    console.error('Connection Error Details:', {
                        url: error.url,
                        apiUrl: environment.apiUrl,
                        message: 'Request blocked - likely CORS or server not running',
                        suggestion: 'Check that backend CORS includes: ' + window.location.origin
                    });
                    handleConnectionError(toast);
                    (error as any).notified = true;
                } else {
                    // Use centralized error handling
                    handleGenericError(error, toast, auth, router);
                    (error as any).notified = true;
                }
            }

            console.error('HTTP Error:', {
                status: error.status,
                url: error.url,
                error: error
            });

            return throwError(() => error);
        })
    );
};
