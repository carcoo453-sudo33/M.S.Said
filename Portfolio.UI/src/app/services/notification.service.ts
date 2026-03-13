import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, interval } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { Notification as AppNotification, NotificationStats } from '../models/notification.model';
import { SignalRService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private signalR = inject(SignalRService);
  private apiUrl = `${environment.apiUrl}/notifications`;

  // Signals for reactive state
  // Read-only signals mapping to SignalRService
  notifications = this.signalR.notifications;
  unreadCount = signal(0);
  isLoading = signal(false);
  isConnected = this.signalR.adminOnlineStatus; // Simplified connection status

  constructor() {
    // Initial stats load
    this.loadStats();

    // Poll for new notifications every 3x seconds as fallback
    interval(30000).subscribe(() => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.loadStats();
      }
    });
  }

  public reconnect(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.signalR.reconnectWithAuth();
    }
  }

  public disconnect(): void {
    this.signalR.stopConnection();
  }

  getNotifications(limit: number = 50, unreadOnly: boolean = false): Observable<AppNotification[]> {
    this.isLoading.set(true);
    const params: any = { limit };
    if (unreadOnly) {
      params.unreadOnly = true;
    }

    return this.http.get<AppNotification[]>(this.apiUrl, { params }).pipe(
      tap(notifications => {
        // Merge with existing notifications from SignalR, avoiding duplicates
        const existing = this.notifications();
        const existingIds = new Set(existing.map(n => n.id));
        const newNotifications = notifications.filter(n => !existingIds.has(n.id));
        
        // Combine: new from API + existing from SignalR, sorted by date
        const merged = [...newNotifications, ...existing].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        this.notifications.set(merged);
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

  getTimeAgo(date: Date | string): string {
    const now = new Date();
    // Ensure Date considers this as UTC, as the .NET backend sends UTC without a Z trailing character sometimes
    let dateStr = date instanceof Date ? date.toISOString() : date.toString();
    if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
      dateStr += 'Z';
    }
    const notificationDate = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return notificationDate.toLocaleDateString();
  }

  private showBrowserNotification(notification: AppNotification): void {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      return;
    }

    // Check permission
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id
      });
    } else if (Notification.permission !== 'denied') {
      // Request permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
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
