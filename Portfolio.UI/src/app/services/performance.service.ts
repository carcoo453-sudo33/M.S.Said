import { Injectable, signal, computed } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private _metrics = signal<Partial<PerformanceMetrics>>({});
  private _networkInfo = signal<Partial<NetworkInfo>>({});
  private _isSlowConnection = signal(false);

  metrics = computed(() => this._metrics());
  networkInfo = computed(() => this._networkInfo());
  isSlowConnection = computed(() => this._isSlowConnection());

  constructor() {
    this.initializePerformanceMonitoring();
    this.initializeNetworkMonitoring();
  }

  private initializePerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    this.measureCoreWebVitals();
    
    // Navigation timing
    this.measureNavigationTiming();
  }

  private measureCoreWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        this._metrics.update(m => ({ ...m, fcp: fcp.startTime }));
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this._metrics.update(m => ({ ...m, lcp: lastEntry.startTime }));
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this._metrics.update(m => ({ ...m, fid: entry.processingStart - entry.startTime }));
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this._metrics.update(m => ({ ...m, cls: clsValue }));
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
  private measureNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.fetchStart;
        this._metrics.update(m => ({ ...m, ttfb }));
      }
    });
  }

  private initializeNetworkMonitoring() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        this._networkInfo.set({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });

        // Determine if connection is slow
        const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                connection.effectiveType === '2g' ||
                                connection.saveData;
        this._isSlowConnection.set(isSlowConnection);
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
    }
  }

  // Performance optimization recommendations
  getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this._metrics();
    const network = this._networkInfo();

    if (metrics.fcp && metrics.fcp > 2500) {
      recommendations.push('Consider optimizing First Contentful Paint (FCP)');
    }

    if (metrics.lcp && metrics.lcp > 4000) {
      recommendations.push('Optimize Largest Contentful Paint (LCP) - consider image optimization');
    }

    if (metrics.fid && metrics.fid > 300) {
      recommendations.push('Reduce First Input Delay (FID) - minimize JavaScript execution');
    }

    if (metrics.cls && metrics.cls > 0.25) {
      recommendations.push('Improve Cumulative Layout Shift (CLS) - reserve space for dynamic content');
    }

    if (this._isSlowConnection()) {
      recommendations.push('Slow connection detected - enable data saving features');
    }

    return recommendations;
  }

  // Log performance metrics to console (development only)
  logMetrics() {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.group('🚀 Performance Metrics');
      console.table(this._metrics());
      console.table(this._networkInfo());
      console.log('📊 Recommendations:', this.getOptimizationRecommendations());
      console.groupEnd();
    }
  }

  // Send metrics to analytics (production)
  sendMetricsToAnalytics() {
    const metrics = this._metrics();
    // Implement your analytics service here
    // Example: Google Analytics, Adobe Analytics, etc.
    console.log('Sending metrics to analytics:', metrics);
  }
}