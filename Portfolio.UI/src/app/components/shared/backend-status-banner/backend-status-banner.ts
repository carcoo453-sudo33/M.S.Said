import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendHealthService } from '../../../services/backend-health.service';
import { AlertCircle, CheckCircle } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-backend-status-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="!backendHealth.isBackendHealthy()" 
         class="fixed top-20 left-0 right-0 z-40 bg-red-50 dark:bg-red-950/30 border-b-2 border-red-500 px-4 py-3">
      <div class="max-w-7xl mx-auto flex items-center gap-3">
        <lucide-icon [img]="AlertCircle" class="w-5 h-5 text-red-600 flex-shrink-0"></lucide-icon>
        <div class="flex-1">
          <p class="text-sm font-semibold text-red-800 dark:text-red-200">
            Backend API is not responding
          </p>
          <p class="text-xs text-red-700 dark:text-red-300 mt-1">
            Trying to connect to: {{ backendHealth.getBackendUrl() }}
          </p>
        </div>
        <button (click)="backendHealth.checkHealth()" 
                class="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors">
          Retry
        </button>
      </div>
    </div>

    <div *ngIf="backendHealth.isBackendHealthy()" 
         class="fixed top-20 left-0 right-0 z-40 bg-green-50 dark:bg-green-950/30 border-b-2 border-green-500 px-4 py-2">
      <div class="max-w-7xl mx-auto flex items-center gap-3">
        <lucide-icon [img]="CheckCircle" class="w-4 h-4 text-green-600 flex-shrink-0"></lucide-icon>
        <p class="text-xs font-semibold text-green-800 dark:text-green-200">
          Backend API is connected
        </p>
      </div>
    </div>
  `
})
export class BackendStatusBannerComponent {
  public backendHealth = inject(BackendHealthService);
  AlertCircle = AlertCircle;
  CheckCircle = CheckCircle;
}
