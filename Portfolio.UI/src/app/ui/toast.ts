import { Component, Input, Output, EventEmitter, signal, computed, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-angular';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = computed(() => this._toasts());

  show(toast: Omit<Toast, 'id'>): string {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      variant: 'default',
      ...toast
    };

    this._toasts.update(toasts => [...toasts, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duration);
    }

    return id;
  }

  success(description: string, title?: string): string {
    return this.show({ title, description, variant: 'success' });
  }

  error(description: string, title?: string): string {
    return this.show({ title, description, variant: 'destructive' });
  }

  warning(description: string, title?: string): string {
    return this.show({ title, description, variant: 'warning' });
  }

  info(description: string, title?: string): string {
    return this.show({ title, description, variant: 'info' });
  }

  dismiss(id: string) {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  dismissAll() {
    this._toasts.set([]);
  }
}

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="toastClasses" role="alert">
      <!-- Icon -->
      <div *ngIf="showIcon" class="flex-shrink-0">
        <lucide-icon [img]="getIcon()" [class]="iconClasses"></lucide-icon>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div *ngIf="toast.title" class="font-semibold text-sm">
          {{ toast.title }}
        </div>
        <div *ngIf="toast.description" [class]="descriptionClasses">
          {{ toast.description }}
        </div>
      </div>

      <!-- Action -->
      <button 
        *ngIf="toast.action"
        (click)="toast.action.onClick()"
        class="text-sm font-medium hover:underline focus:outline-none focus:underline">
        {{ toast.action.label }}
      </button>

      <!-- Close Button -->
      <button 
        (click)="onClose()"
        class="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500">
        <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
      </button>
    </div>
  `
})
export class ToastComponent {
  @Input() toast!: Toast;
  @Input() showIcon = true;
  @Output() close = new EventEmitter<void>();

  XIcon = X;
  CheckCircleIcon = CheckCircle;
  AlertCircleIcon = AlertCircle;
  InfoIcon = Info;
  AlertTriangleIcon = AlertTriangle;

  get toastClasses(): string {
    const variantClasses = {
      default: 'bg-background text-foreground border-border',
      destructive: 'bg-destructive text-destructive-foreground border-destructive',
      success: 'bg-green-50 text-green-800 border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      info: 'bg-blue-50 text-blue-800 border-blue-200'
    };

    return `flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full ${variantClasses[this.toast.variant || 'default']}`;
  }

  get iconClasses(): string {
    const variantClasses = {
      default: 'text-foreground',
      destructive: 'text-destructive-foreground',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600'
    };

    return `w-5 h-5 ${variantClasses[this.toast.variant || 'default']}`;
  }

  get descriptionClasses(): string {
    return `text-sm ${this.toast.title ? 'mt-1 text-muted-foreground' : ''}`;
  }

  getIcon() {
    switch (this.toast.variant) {
      case 'success':
        return this.CheckCircleIcon;
      case 'destructive':
        return this.AlertCircleIcon;
      case 'warning':
        return this.AlertTriangleIcon;
      case 'info':
        return this.InfoIcon;
      default:
        return this.InfoIcon;
    }
  }

  onClose() {
    this.close.emit();
  }
}

@Component({
  selector: 'ui-toaster',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      <ui-toast 
        *ngFor="let toast of toastService.toasts(); trackBy: trackByFn"
        [toast]="toast"
        (close)="toastService.dismiss(toast.id)">
      </ui-toast>
    </div>
  `
})
export class ToasterComponent {
  toastService = inject(ToastService);

  trackByFn(index: number, toast: Toast): string {
    return toast.id;
  }
}