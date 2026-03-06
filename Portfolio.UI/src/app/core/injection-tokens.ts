import { InjectionToken } from '@angular/core';

// Configuration tokens
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const FEATURE_FLAGS = new InjectionToken<Record<string, boolean>>('FEATURE_FLAGS');
export const CACHE_CONFIG = new InjectionToken<CacheConfig>('CACHE_CONFIG');
export const PERFORMANCE_CONFIG = new InjectionToken<PerformanceConfig>('PERFORMANCE_CONFIG');

// Service tokens for better testability
export const STORAGE_SERVICE = new InjectionToken<Storage>('STORAGE_SERVICE');
export const LOGGER_SERVICE = new InjectionToken<Logger>('LOGGER_SERVICE');
export const ANALYTICS_SERVICE = new InjectionToken<Analytics>('ANALYTICS_SERVICE');

// Multi-provider tokens
export const HTTP_INTERCEPTORS_MULTI = new InjectionToken<any[]>('HTTP_INTERCEPTORS_MULTI');
export const ROUTE_GUARDS = new InjectionToken<any[]>('ROUTE_GUARDS');

// Configuration interfaces
export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enablePersistence: boolean;
}

export interface PerformanceConfig {
  enableMetrics: boolean;
  sampleRate: number;
  reportingEndpoint?: string;
}

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

export interface Analytics {
  track(event: string, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
}