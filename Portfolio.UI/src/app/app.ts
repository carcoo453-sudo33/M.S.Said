import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/shared/toast.component';
import { SignalRService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html'
})
export class App implements OnInit {
  protected readonly title = signal('Portfolio.UI');
  private signalRService = inject(SignalRService);

  ngOnInit() {
    // Start SignalR connection when app loads
    this.signalRService.startConnection();
  }
}
