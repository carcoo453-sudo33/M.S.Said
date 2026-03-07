import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// Centralized error handling functions that accept injected services
export function handleAuthError(error: any, toast: ToastService, auth: AuthService, router: Router): void {
    if (error.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        auth.logout();
        router.navigate(['/login']);
    }
}

export function handleConnectionError(toast: ToastService): void {
    toast.error('Connection lost. Please check your internet connection.', {
        persistent: true,
        action: {
            label: 'Retry',
            onClick: () => {
                window.location.reload();
            }
        }
    });
}

export function handleGenericError(error: any, toast: ToastService, auth: AuthService, router: Router, customMessage?: string): void {
    let message = customMessage || 'An unexpected error occurred';
    
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