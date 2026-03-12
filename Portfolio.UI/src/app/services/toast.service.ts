import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration?: number;
    action?: ToastAction;
    dismissible?: boolean;
    persistent?: boolean;
}

export interface ToastOptions {
    duration?: number;
    action?: ToastAction;
    dismissible?: boolean;
    persistent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toasts = signal<Toast[]>([]);
    public readonly toasts$ = this.toasts.asReadonly();
    private nextId = 0;

    success(message: string, options?: ToastOptions) {
        this.add(message, 'success', options);
    }

    error(message: string, options?: ToastOptions) {
        this.add(message, 'error', options);
    }

    info(message: string, options?: ToastOptions) {
        this.add(message, 'info', options);
    }

    warning(message: string, options?: ToastOptions) {
        this.add(message, 'warning', options);
    }

    // Promise-based toasts like Sonner
    promise<T>(
        promise: Promise<T>,
        {
            loading,
            success,
            error
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ): Promise<T> {
        const loadingToast = this.add(loading, 'info', { persistent: true, dismissible: false });

        return promise
            .then((data) => {
                this.remove(loadingToast);
                const successMessage = typeof success === 'function' ? success(data) : success;
                this.success(successMessage);
                return data;
            })
            .catch((err) => {
                this.remove(loadingToast);
                const errorMessage = typeof error === 'function' ? error(err) : error;
                this.error(errorMessage);
                throw err;
            });
    }

    private add(message: string, type: ToastType, options?: ToastOptions): number {
        // Prevent duplicate toasts with the same message and type from appearing multiple times
        const currentToasts = this.toasts();
        const isDuplicate = currentToasts.some(t => t.message === message && t.type === type);
        if (isDuplicate) {
            // Return existing toast ID
            return currentToasts.find(t => t.message === message && t.type === type)?.id ?? -1;
        }

        const id = this.nextId++;
        const duration = options?.duration ?? (type === 'error' ? 6000 : 4000);

        const toast: Toast = {
            id,
            message,
            type,
            duration,
            action: options?.action,
            dismissible: options?.dismissible ?? true,
            persistent: options?.persistent ?? false
        };

        this.toasts.update(current => [...current, toast]);

        // Auto remove after duration (unless persistent)
        if (!toast.persistent) {
            setTimeout(() => this.remove(id), duration);
        }

        return id;
    }

    remove(id: number) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }

    clear() {
        this.toasts.set([]);
    }

    // Dismiss all non-persistent toasts
    dismissAll() {
        this.toasts.update(current => current.filter(t => t.persistent));
    }
}
