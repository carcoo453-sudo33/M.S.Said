import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface BackendHealth {
  isHealthy: boolean;
  url: string;
  lastChecked: Date;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendHealthService {
  private readonly http = inject(HttpClient);
  public backendHealth = signal<BackendHealth>({
    isHealthy: false,
    url: environment.apiBaseUrl,
    lastChecked: new Date()
  });

  constructor() {
    this.checkHealth();
    // Check every 30 seconds
    setInterval(() => this.checkHealth(), 30000);
  }

  public checkHealth(): void {
    const healthUrl = `${environment.apiBaseUrl}/health`;
    
    this.http.get(healthUrl, { responseType: 'text' }).subscribe({
      next: () => {
        this.backendHealth.set({
          isHealthy: true,
          url: environment.apiBaseUrl,
          lastChecked: new Date()
        });
        console.log('✅ Backend is healthy');
      },
      error: (err) => {
        this.backendHealth.set({
          isHealthy: false,
          url: environment.apiBaseUrl,
          lastChecked: new Date(),
          error: err.message || 'Backend is not responding'
        });
        console.error('❌ Backend health check failed:', err);
      }
    });
  }

  public isBackendHealthy(): boolean {
    return this.backendHealth().isHealthy;
  }

  public getBackendUrl(): string {
    return environment.apiBaseUrl;
  }
}
