import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceService } from '../../../services/performance.service';
import { FEATURE_FLAGS, LOGGER_SERVICE } from '../../../core/injection-tokens';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-performance-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showMonitor && isDevelopment" class="fixed bottom-4 right-4 z-50">
      <div class="bg-black/80 text-white p-3 rounded-lg text-xs font-mono max-w-xs">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">Performance</span>
          <button (click)="toggleExpanded()" class="text-gray-300 hover:text-white">
            {{ isExpanded ? '−' : '+' }}
          </button>
        </div>
        
        <div *ngIf="isExpanded" class="space-y-1">
          <div *ngIf="metrics.fcp" class="flex justify-between">
            <span>FCP:</span>
            <span [class]="getMetricClass('fcp')">{{ metrics.fcp | number:'1.0-0' }}ms</span>
          </div>
          
          <div *ngIf="metrics.lcp" class="flex justify-between">
            <span>LCP:</span>
            <span [class]="getMetricClass('lcp')">{{ metrics.lcp | number:'1.0-0' }}ms</span>
          </div>
          
          <div *ngIf="metrics.fid" class="flex justify-between">
            <span>FID:</span>
            <span [class]="getMetricClass('fid')">{{ metrics.fid | number:'1.0-0' }}ms</span>
          </div>
          
          <div *ngIf="metrics.cls" class="flex justify-between">
            <span>CLS:</span>
            <span [class]="getMetricClass('cls')">{{ metrics.cls | number:'1.0-3' }}</span>
          </div>
          
          <div *ngIf="networkInfo.effectiveType" class="flex justify-between">
            <span>Network:</span>
            <span [class]="getNetworkClass()">{{ networkInfo.effectiveType }}</span>
          </div>
          
          <div *ngIf="isSlowConnection" class="text-yellow-400 text-center mt-2">
            🐌 Slow Connection
          </div>
        </div>
      </div>
    </div>
  `
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy {
  private performanceService = inject(PerformanceService);
  private featureFlags = inject(FEATURE_FLAGS);
  private logger = inject(LOGGER_SERVICE);
  private subscription?: Subscription;

  showMonitor = false;
  isExpanded = false;
  isDevelopment = false;

  get metrics() {
    return this.performanceService.metrics();
  }

  get networkInfo() {
    return this.performanceService.networkInfo();
  }

  get isSlowConnection() {
    return this.performanceService.isSlowConnection();
  }

  ngOnInit() {
    this.isDevelopment = typeof window !== 'undefined' && 
                       window.location.hostname === 'localhost';
    
    this.showMonitor = this.featureFlags.enablePerformanceMonitoring && this.isDevelopment;

    if (this.showMonitor) {
      // Update metrics every 5 seconds
      this.subscription = interval(5000).subscribe(() => {
        this.performanceService.logMetrics();
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  getMetricClass(metric: string): string {
    const value = this.metrics[metric as keyof typeof this.metrics];
    if (!value) return 'text-gray-400';

    switch (metric) {
      case 'fcp':
        return value > 2500 ? 'text-red-400' : value > 1800 ? 'text-yellow-400' : 'text-green-400';
      case 'lcp':
        return value > 4000 ? 'text-red-400' : value > 2500 ? 'text-yellow-400' : 'text-green-400';
      case 'fid':
        return value > 300 ? 'text-red-400' : value > 100 ? 'text-yellow-400' : 'text-green-400';
      case 'cls':
        return value > 0.25 ? 'text-red-400' : value > 0.1 ? 'text-yellow-400' : 'text-green-400';
      default:
        return 'text-white';
    }
  }

  getNetworkClass(): string {
    const type = this.networkInfo.effectiveType;
    if (type === 'slow-2g' || type === '2g') return 'text-red-400';
    if (type === '3g') return 'text-yellow-400';
    return 'text-green-400';
  }
}