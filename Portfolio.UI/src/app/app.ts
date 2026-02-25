import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/shared/toast.component';
import { SignalRService } from './services/signalr.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html'
})
export class App implements OnInit {
  protected readonly title = signal('Portfolio.UI');
  private signalRService = inject(SignalRService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  ngOnInit() {
    // Start SignalR connection when app loads
    this.signalRService.startConnection();
    
    // Initialize notification service if user is logged in
    if (this.authService.isLoggedIn()) {
      this.notificationService.loadStats();
      this.notificationService.reconnect();
    }
  }
}
