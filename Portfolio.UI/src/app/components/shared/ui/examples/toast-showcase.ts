import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button';
import { CardComponent } from '../card/card';
import { ToastService } from '../../../../services/toast.service';
import { ToastComponent } from '../../toast.component';

@Component({
    selector: 'toast-showcase',
    standalone: true,
    imports: [CommonModule, ButtonComponent, CardComponent, ToastComponent],
    template: `
        <div class="max-w-4xl mx-auto p-6 space-y-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Toast Notifications</h1>
                <p class="text-zinc-600 dark:text-zinc-400">Sonner-style toast notifications with dark mode support</p>
            </div>

            <!-- Basic Toasts -->
            <ui-card title="Basic Toasts" description="Standard notification types">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ui-button variant="outline" (onClick)="showSuccess()">
                        Success
                    </ui-button>
                    <ui-button variant="outline" (onClick)="showError()">
                        Error
                    </ui-button>
                    <ui-button variant="outline" (onClick)="showWarning()">
                        Warning
                    </ui-button>
                    <ui-button variant="outline" (onClick)="showInfo()">
                        Info
                    </ui-button>
                </div>
            </ui-card>

            <!-- Advanced Toasts -->
            <ui-card title="Advanced Features" description="Toasts with actions and custom durations">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ui-button variant="secondary" (onClick)="showWithAction()">
                        With Action
                    </ui-button>
                    <ui-button variant="secondary" (onClick)="showPersistent()">
                        Persistent
                    </ui-button>
                    <ui-button variant="secondary" (onClick)="showLongDuration()">
                        Long Duration
                    </ui-button>
                </div>
            </ui-card>

            <!-- Promise Toasts -->
            <ui-card title="Promise Toasts" description="Toasts that track async operations">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ui-button variant="primary" (onClick)="showPromiseSuccess()">
                        Promise Success
                    </ui-button>
                    <ui-button variant="destructive" (onClick)="showPromiseError()">
                        Promise Error
                    </ui-button>
                </div>
            </ui-card>

            <!-- Toast Management -->
            <ui-card title="Toast Management" description="Control multiple toasts">
                <div class="flex flex-wrap gap-4">
                    <ui-button variant="outline" (onClick)="showMultiple()">
                        Show Multiple
                    </ui-button>
                    <ui-button variant="ghost" (onClick)="dismissAll()">
                        Dismiss All
                    </ui-button>
                    <ui-button variant="ghost" (onClick)="clearAll()">
                        Clear All
                    </ui-button>
                </div>
            </ui-card>
        </div>

        <!-- Toast Container -->
        <app-toast></app-toast>
    `
})
export class ToastShowcaseComponent {
    private toastService = inject(ToastService);

    showSuccess(): void {
        this.toastService.success('Operation completed successfully!');
    }

    showError(): void {
        this.toastService.error('Something went wrong. Please try again.');
    }

    showWarning(): void {
        this.toastService.warning('This action cannot be undone.');
    }

    showInfo(): void {
        this.toastService.info('New features are now available.');
    }

    showWithAction(): void {
        this.toastService.success('File uploaded successfully!', {
            action: {
                label: 'View',
                onClick: () => {
                    console.log('View action clicked');
                    this.toastService.info('Navigating to file...');
                }
            }
        });
    }

    showPersistent(): void {
        this.toastService.error('Connection lost. Please check your internet.', {
            persistent: true,
            action: {
                label: 'Retry',
                onClick: () => {
                    console.log('Retry clicked');
                    this.toastService.success('Connection restored!');
                }
            }
        });
    }

    showLongDuration(): void {
        this.toastService.info('This toast will stay for 10 seconds.', {
            duration: 10000
        });
    }

    showPromiseSuccess(): void {
        const promise = new Promise<string>((resolve) => {
            setTimeout(() => resolve('Data loaded successfully'), 2000);
        });

        this.toastService.promise(promise, {
            loading: 'Loading data...',
            success: (data) => data,
            error: 'Failed to load data'
        });
    }

    showPromiseError(): void {
        const promise = new Promise<string>((_, reject) => {
            setTimeout(() => reject(new Error('Network error')), 2000);
        });

        this.toastService.promise(promise, {
            loading: 'Saving changes...',
            success: 'Changes saved successfully',
            error: (err) => `Failed to save: ${err.message}`
        });
    }

    showMultiple(): void {
        this.toastService.success('First notification');
        setTimeout(() => this.toastService.info('Second notification'), 500);
        setTimeout(() => this.toastService.warning('Third notification'), 1000);
    }

    dismissAll(): void {
        this.toastService.dismissAll();
    }

    clearAll(): void {
        this.toastService.clear();
    }
}