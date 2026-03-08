import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, XCircle, AlertTriangle, Info, X, Loader } from 'lucide-angular';
import { ToastService, Toast, ToastType } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
        <!-- Toast Container - Sonner Style -->
        <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            <div 
                *ngFor="let toast of toasts(); let i = index; trackBy: trackByToast"
                [class]="getToastClasses(toast, i)"
                [style.transform]="getToastTransform(i)"
                [style.z-index]="100 - i"
                class="pointer-events-auto">
                
                <!-- Toast Content -->
                <div class="flex items-start gap-3 p-4">
                    <!-- Icon -->
                    <div [class]="getIconClasses(toast.type)">
                        <lucide-icon 
                            [img]="getIcon(toast.type)" 
                            class="w-5 h-5"
                            [class.animate-spin]="isLoading(toast)">
                        </lucide-icon>
                    </div>

                    <!-- Message and Action -->
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-zinc-900 dark:text-white leading-5">
                            {{ toast.message }}
                        </p>
                        
                        <!-- Action Button -->
                        <button 
                            *ngIf="toast.action"
                            type="button"
                            class="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                            (click)="executeAction(toast)">
                            {{ toast.action.label }}
                        </button>
                    </div>

                    <!-- Close Button -->
                    <button
                        *ngIf="toast.dismissible !== false"
                        type="button"
                        class="flex-shrink-0 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        (click)="closeToast(toast.id)"
                        aria-label="Close notification">
                        <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>

                <!-- Progress Bar (only for non-persistent toasts) -->
                <div 
                    *ngIf="!toast.persistent && toast.duration && !isLoading(toast)"
                    class="h-1 bg-zinc-200 dark:bg-zinc-700 rounded-b-xl overflow-hidden">
                    <div 
                        [class]="getProgressBarClasses(toast.type)"
                        [style.animation-duration]="toast.duration + 'ms'"
                        class="h-full animate-toast-progress origin-left">
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        @keyframes toast-enter {
            from {
                opacity: 0;
                transform: translateX(100%) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
        }

        @keyframes toast-progress {
            from {
                transform: scaleX(1);
            }
            to {
                transform: scaleX(0);
            }
        }

        .animate-toast-enter {
            animation: toast-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-toast-progress {
            animation: toast-progress linear;
        }
    `]
})
export class ToastComponent {
    private toastService = inject(ToastService);
    toasts = this.toastService.toasts$;

    // Icons - Using non-deprecated versions
    CheckCircleIcon = CheckCircle;
    XCircleIcon = XCircle;
    AlertTriangleIcon = AlertTriangle;
    InfoIcon = Info;
    LoaderIcon = Loader;
    XIcon = X;

    constructor() { }

    trackByToast(index: number, toast: Toast): number {
        return toast.id;
    }

    closeToast(id: number): void {
        this.toastService.remove(id);
    }

    executeAction(toast: Toast): void {
        if (toast.action) {
            toast.action.onClick();
            this.closeToast(toast.id);
        }
    }

    isLoading(toast: Toast): boolean {
        return toast.message.toLowerCase().includes('loading') ||
            toast.message.toLowerCase().includes('saving') ||
            toast.persistent === true && toast.dismissible === false;
    }

    getIcon(type: ToastType): any {
        const icons = {
            success: this.CheckCircleIcon,
            error: this.XCircleIcon,
            warning: this.AlertTriangleIcon,
            info: this.InfoIcon
        };
        return icons[type];
    }

    getToastClasses(toast: Toast, index: number): string {
        const baseClasses = 'relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 animate-toast-enter';

        const typeClasses = {
            success: 'border-l-4 border-l-green-500',
            error: 'border-l-4 border-l-red-500',
            warning: 'border-l-4 border-l-yellow-500',
            info: 'border-l-4 border-l-blue-500'
        };

        // Add stacking effect like Sonner
        const stackingClasses = index > 0 ? 'scale-95 opacity-90' : '';

        return `${baseClasses} ${typeClasses[toast.type]} ${stackingClasses}`.trim();
    }

    getToastTransform(index: number): string {
        // Create stacking effect - each toast is slightly offset
        const offset = index * 4;
        return `translateY(-${offset}px)`;
    }

    getIconClasses(type: ToastType): string {
        const baseClasses = 'flex-shrink-0 rounded-full p-1';

        const typeClasses = {
            success: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
            error: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
            warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
            info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
        };

        return `${baseClasses} ${typeClasses[type]}`.trim();
    }

    getProgressBarClasses(type: ToastType): string {
        const typeClasses = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        return typeClasses[type];
    }
}