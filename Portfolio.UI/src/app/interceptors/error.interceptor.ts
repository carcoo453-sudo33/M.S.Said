import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
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
                    errorMessage = 'Unable to connect to the server. Please check if the API is running.';
                } else if (error.status === 404) {
                    errorMessage = 'Resource not found';
                } else if (error.status === 500) {
                    errorMessage = 'Server error occurred';
                } else {
                    errorMessage = `Error ${error.status}: ${error.message}`;
                }
            }

            console.error('HTTP Error:', errorMessage, error);
            
            // Only show toast for critical errors (not 404s on optional resources)
            if (error.status !== 404) {
                toast.error(errorMessage);
            }

            return throwError(() => error);
        })
    );
};
