import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/shared/toast.component';
import { PerformanceMonitorComponent } from './components/shared/performance-monitor/performance-monitor';
import { BackendStatusBannerComponent } from './components/shared/backend-status-banner/backend-status-banner';
import { SignalRService } from './services/signalr.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { PerformanceService } from './services/performance.service';
import { BackendHealthService } from './services/backend-health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, PerformanceMonitorComponent, BackendStatusBannerComponent],
  templateUrl: './app.html'
})
export class App implements OnInit {
  protected readonly title = signal('Portfolio.UI');
  private signalRService = inject(SignalRService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private performanceService = inject(PerformanceService);
  private backendHealthService = inject(BackendHealthService);

  ngOnInit() {
    // Start SignalR connection when app loads
    this.signalRService.startConnection();
    
    // Initialize notification service if user is logged in
    if (this.authService.isLoggedIn()) {
      this.notificationService.loadStats();
      this.notificationService.reconnect();
    }

    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring() {
    // Log performance metrics after initial load
    setTimeout(() => {
      this.performanceService.logMetrics();
    }, 3000);
  }
}

