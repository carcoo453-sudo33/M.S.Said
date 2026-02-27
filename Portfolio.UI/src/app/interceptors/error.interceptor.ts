import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { environment } from '../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const toast = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                if (error.status === 0) {
                    // Status 0 means the request was blocked before reaching the server
                    // This is usually a CORS issue or the server is not running
                    errorMessage = `Unable to connect to API server at ${environment.apiUrl}. `;
                    
                    // Check if it's likely a CORS issue
                    if (error.url && error.url.includes('http')) {
                        errorMessage += 'This may be a CORS configuration issue. ';
                    }
                    
                    errorMessage += 'Please ensure the backend is running and CORS is configured correctly.';
                    
                    console.error('Connection Error Details:', {
                        url: error.url,
                        apiUrl: environment.apiUrl,
                        message: 'Request blocked - likely CORS or server not running',
                        suggestion: 'Check that backend CORS includes: ' + window.location.origin
                    });
                } else if (error.status === 404) {
                    errorMessage = 'Resource not found';
                } else if (error.status === 500) {
                    errorMessage = 'Server error occurred';
                } else if (error.status === 401) {
                    errorMessage = 'Unauthorized - Please login';
                } else if (error.status === 403) {
                    errorMessage = 'Access forbidden';
                } else {
                    errorMessage = `Error ${error.status}: ${error.message}`;
                }
            }

            console.error('HTTP Error:', {
                status: error.status,
                message: errorMessage,
                url: error.url,
                error: error
            });
            
            // Only show toast for critical errors (not 404s on optional resources)
            if (error.status !== 404) {
                toast.error(errorMessage);
            }

            return throwError(() => error);
        })
    );
};
