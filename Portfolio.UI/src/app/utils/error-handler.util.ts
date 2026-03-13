import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Error handling utility functions for centralized error management
 * Functions accept injected services as parameters
 */

/**
 * Handle authentication errors (401 Unauthorized)
 * Logs out user and redirects to login page
 * @param error Error object from HTTP response
 * @param toast Toast service for notifications
 * @param auth Auth service for logout
 * @param router Router for navigation
 */
export function handleAuthError(error: any, toast: ToastService, auth: AuthService, router: Router): void {
    if (error.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        auth.logout();
        router.navigate(['/login']);
    }
}

/**
 * Handle connection errors (network unavailable)
 * Shows persistent error with retry option
 * @param toast Toast service for notifications
 */
export function handleConnectionError(toast: ToastService): void {
    toast.error('Connection lost. Please check your internet connection.', {
        duration: 10000,
        action: {
            label: 'Retry',
            onClick: () => {
                globalThis.location.reload();
            }
        }
    });
}

/**
 * Handle generic HTTP errors with appropriate messages
 * Routes to specific handlers based on status code
 * @param error Error object from HTTP response
 * @param toast Toast service for notifications
 * @param auth Auth service for logout (if needed)
 * @param router Router for navigation (if needed)
 * @param customMessage Optional custom error message
 */
export function handleGenericError(error: any, toast: ToastService, auth: AuthService, router: Router, customMessage: string = 'An unexpected error occurred'): void {
    let message = customMessage;
    
    if (error.status === 401) {
        handleAuthError(error, toast, auth, router);
        return;
    }
    
    if (error.status === 403) {
        message = 'You do not have permission to perform this action';
    } else if (error.status === 404) {
        message = 'The requested resource was not found';
    } else if (error.status === 500) {
        message = 'Server error occurred. Please try again later';
    } else if (error.status === 0) {
        handleConnectionError(toast);
        return;
    }

    toast.error(message);
}