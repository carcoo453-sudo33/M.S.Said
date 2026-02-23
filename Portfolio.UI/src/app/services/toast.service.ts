import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toasts = signal<Toast[]>([]);
    public readonly toasts$ = this.toasts.asReadonly();
    private nextId = 0;

    success(message: string) {
        this.add(message, 'success');
    }

    error(message: string) {
        this.add(message, 'error');
    }

    info(message: string) {
        this.add(message, 'info');
    }

    warning(message: string) {
        this.add(message, 'warning');
    }

    private add(message: string, type: ToastType) {
        const id = this.nextId++;
        this.toasts.update(current => [...current, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => this.remove(id), 4000);
    }

    remove(id: number) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
