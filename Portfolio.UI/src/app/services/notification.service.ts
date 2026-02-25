import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, interval } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { Notification, NotificationStats } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;
  private hubConnection: signalR.HubConnection | null = null;

  // Signals for reactive state
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);
  isLoading = signal(false);
  isConnected = signal(false);

  constructor() {
    // Initialize SignalR connection
    this.initializeSignalRConnection();

    // Poll for new notifications every 30 seconds as fallback
    interval(30000).subscribe(() => {
      const token = localStorage.getItem('auth_token');
      if (token && !this.isConnected()) {
        this.loadStats();
      }
    });
  }

  private initializeSignalRConnection(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('[NotificationService] No auth token, skipping SignalR connection');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/notifications`, {
        accessTokenFactory: () => token,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Handle incoming notifications
    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      console.log('[NotificationService] ✅ Received notification:', notification);
      
      // Add to notifications list at the beginning
      const currentNotifications = this.notifications();
      this.notifications.set([notification, ...currentNotifications]);
      
      // Increment unread count
      if (!notification.isRead) {
        const newCount = this.unreadCount() + 1;
        this.unreadCount.set(newCount);
        console.log('[NotificationService] 📊 Unread count updated:', newCount);
      }
      
      // Show browser notification if permission granted
      this.showBrowserNotification(notification);
    });

    // Handle reconnection
    this.hubConnection.onreconnected(() => {
      console.log('[NotificationService] 🔄 SignalR reconnected');
      this.isConnected.set(true);
      this.loadStats(); // Reload stats after reconnection
    });

    this.hubConnection.onclose(() => {
      console.log('[NotificationService] 🔌 SignalR connection closed');
      this.isConnected.set(false);
    });

    // Start connection
    this.startConnection();
  }

  private async startConnection(): Promise<void> {
    if (!this.hubConnection) return;

    try {
      await this.hubConnection.start();
      console.log('[NotificationService] SignalR connected');
      this.isConnected.set(true);
      
      // Load initial stats after connection
      this.loadStats();
    } catch (err) {
      console.error('[NotificationService] SignalR connection error:', err);
      this.isConnected.set(false);
      
      // Retry connection after 5 seconds
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public reconnect(): void {
    const token = localStorage.getItem('auth_token');
    if (token && !this.isConnected()) {
      this.initializeSignalRConnection();
    }
  }

  public disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.isConnected.set(false);
      console.log('[NotificationService] SignalR disconnected');
    }
  }

  getNotifications(limit: number = 50, unreadOnly: boolean = false): Observable<Notification[]> {
    this.isLoading.set(true);
    const params: any = { limit };
    if (unreadOnly) {
      params.unreadOnly = true;
    }

    return this.http.get<Notification[]>(this.apiUrl, { params }).pipe(
      tap(notifications => {
        this.notifications.set(notifications);
        this.isLoading.set(false);
      })
    );
  }

  getStats(): Observable<NotificationStats> {
    return this.http.get<NotificationStats>(`${this.apiUrl}/stats`).pipe(
      tap(stats => {
        this.unreadCount.set(stats.unreadCount);
      })
    );
  }

  loadStats(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('[NotificationService] No auth token, skipping stats load');
      return;
    }
    
    this.getStats().subscribe({
      error: (err) => console.error('Failed to load notification stats:', err)
    });
  }

  markAsRead(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/mark-read`, {}).pipe(
      tap(() => {
        // Update local state
        const currentNotifications = this.notifications();
        const updatedNotifications = currentNotifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        );
        this.notifications.set(updatedNotifications);
        
        // Decrease unread count
        const currentCount = this.unreadCount();
        if (currentCount > 0) {
          this.unreadCount.set(currentCount - 1);
        }
      })
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(() => {
        // Update local state
        const currentNotifications = this.notifications();
        const updatedNotifications = currentNotifications.map(n => ({ ...n, isRead: true }));
        this.notifications.set(updatedNotifications);
        this.unreadCount.set(0);
      })
    );
  }

  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Update local state
        const currentNotifications = this.notifications();
        const notification = currentNotifications.find(n => n.id === id);
        const updatedNotifications = currentNotifications.filter(n => n.id !== id);
        this.notifications.set(updatedNotifications);
        
        // Decrease unread count if notification was unread
        if (notification && !notification.isRead) {
          const currentCount = this.unreadCount();
          if (currentCount > 0) {
            this.unreadCount.set(currentCount - 1);
          }
        }
      })
    );
  }

  clearAll(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear-all`).pipe(
      tap(() => {
        this.notifications.set([]);
        this.unreadCount.set(0);
      })
    );
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const seconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return notificationDate.toLocaleDateString();
  }

  private showBrowserNotification(notification: Notification): void {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      return;
    }

    // Check permission
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/logo.png',
        badge: '/assets/logo.png',
        tag: notification.id
      });
    } else if (Notification.permission !== 'denied') {
      // Request permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/assets/logo.png',
            badge: '/assets/logo.png',
            tag: notification.id
          });
        }
      });
    }
  }

  public requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}
