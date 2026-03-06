import { Provider, inject, ENVIRONMENT_INITIALIZER } from '@angular/core';
import { 
  API_BASE_URL, 
  FEATURE_FLAGS, 
  CACHE_CONFIG, 
  PERFORMANCE_CONFIG,
  STORAGE_SERVICE,
  LOGGER_SERVICE,
  ANALYTICS_SERVICE,
  CacheConfig,
  PerformanceConfig,
  Logger,
  Analytics
} from './injection-tokens';
import { PerformanceService } from '../services/performance.service';

// Environment-based configuration
export function provideApiConfig(): Provider[] {
  return [
    {
      provide: API_BASE_URL,
      useFactory: () => {
        if (typeof window !== 'undefined') {
          return window.location.hostname === 'localhost' 
            ? 'https://localhost:7297/api'
            : 'https://api.mostafa.dev/api';
        }
        return 'https://api.mostafa.dev/api';
      }
    }
  ];
}

// Feature flags provider
export function provideFeatureFlags(): Provider[] {
  return [
    {
      provide: FEATURE_FLAGS,
      useValue: {
        enableAnalytics: true,
        enablePerformanceMonitoring: true,
        enableImageOptimization: true,
        enableServiceWorker: true,
        enableOfflineMode: false,
        enableExperimentalFeatures: false
      }
    }
  ];
}

// Cache configuration
export function provideCacheConfig(): Provider[] {
  return [
    {
      provide: CACHE_CONFIG,
      useValue: {
        defaultTTL: 5 * 60 * 1000, // 5 minutes
        maxSize: 100,
        enablePersistence: true
      } as CacheConfig
    }
  ];
}

// Performance configuration
export function providePerformanceConfig(): Provider[] {
  return [
    {
      provide: PERFORMANCE_CONFIG,
      useValue: {
        enableMetrics: true,
        sampleRate: 0.1, // 10% sampling
        reportingEndpoint: '/api/metrics'
      } as PerformanceConfig
    }
  ];
}

// Storage service provider
export function provideStorageService(): Provider[] {
  return [
    {
      provide: STORAGE_SERVICE,
      useFactory: () => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage;
        }
        // Fallback for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          length: 0,
          key: () => null
        } as Storage;
      }
    }
  ];
}

// Logger service provider
export function provideLoggerService(): Provider[] {
  return [
    {
      provide: LOGGER_SERVICE,
      useValue: {
        debug: (message: string, ...args: any[]) => {
          if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.debug(`[DEBUG] ${message}`, ...args);
          }
        },
        info: (message: string, ...args: any[]) => {
          console.info(`[INFO] ${message}`, ...args);
        },
        warn: (message: string, ...args: any[]) => {
          console.warn(`[WARN] ${message}`, ...args);
        },
        error: (message: string, ...args: any[]) => {
          console.error(`[ERROR] ${message}`, ...args);
        }
      } as Logger
    }
  ];
}
// Analytics service provider
export function provideAnalyticsService(): Provider[] {
  return [
    {
      provide: ANALYTICS_SERVICE,
      useValue: {
        track: (event: string, properties?: Record<string, any>) => {
          // Implement your analytics tracking here
          console.log(`[ANALYTICS] Track: ${event}`, properties);
        },
        identify: (userId: string, traits?: Record<string, any>) => {
          console.log(`[ANALYTICS] Identify: ${userId}`, traits);
        },
        page: (name: string, properties?: Record<string, any>) => {
          console.log(`[ANALYTICS] Page: ${name}`, properties);
        }
      } as Analytics
    }
  ];
}

// Performance monitoring initializer
export function providePerformanceMonitoring(): Provider[] {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => {
        const performanceService = inject(PerformanceService);
        const featureFlags = inject(FEATURE_FLAGS);
        
        if (featureFlags.enablePerformanceMonitoring) {
          // Initialize performance monitoring
          setTimeout(() => {
            performanceService.logMetrics();
          }, 5000); // Log metrics after 5 seconds
        }
      },
      multi: true
    }
  ];
}

// Combine all core providers
export function provideCoreServices(): Provider[] {
  return [
    ...provideApiConfig(),
    ...provideFeatureFlags(),
    ...provideCacheConfig(),
    ...providePerformanceConfig(),
    ...provideStorageService(),
    ...provideLoggerService(),
    ...provideAnalyticsService(),
    ...providePerformanceMonitoring()
  ];
}