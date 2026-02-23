import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-angular';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div *ngFor="let toast of toastService.toasts$()" 
           class="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl min-w-[300px] max-w-md animate-fade-in-up"
           [ngClass]="getToastClasses(toast)">
        
        <div class="shrink-0">
          <lucide-icon [img]="getIcon(toast)" class="w-5 h-5"></lucide-icon>
        </div>

        <div class="flex-1 text-sm font-bold tracking-tight">
          {{ toast.message }}
        </div>

        <button (click)="toastService.remove(toast.id)" 
                class="shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
          <lucide-icon [img]="XIcon" class="w-3.5 h-3.5 opacity-50"></lucide-icon>
        </button>
      </div>
    </div>
  `,
    styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(1rem) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastComponent {
    public toastService = inject(ToastService);
    XIcon = X;

    getIcon(toast: Toast) {
        switch (toast.type) {
            case 'success': return CheckCircle;
            case 'error': return AlertCircle;
            case 'warning': return AlertTriangle;
            case 'info': return Info;
        }
    }

    getToastClasses(toast: Toast) {
        switch (toast.type) {
            case 'success':
                return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400';
            case 'error':
                return 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-400';
            case 'warning':
                return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-400';
        }
    }
}
