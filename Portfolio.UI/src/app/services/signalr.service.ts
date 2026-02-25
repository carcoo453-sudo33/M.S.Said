import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection?: signalR.HubConnection;
  public adminOnlineStatus = signal<boolean>(false);

  constructor() {}

  public startConnection(): void {
    const token = localStorage.getItem('auth_token');
    
    const options: signalR.IHttpConnectionOptions = {
      skipNegotiation: false,
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling,
      withCredentials: true
    };

    // Only add token if it exists (for admin)
    if (token) {
      options.accessTokenFactory = () => token;
    }

    const hubUrl = `${environment.apiBaseUrl}/hubs/notifications`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, options)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Error) // Only show errors
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR Connected');
        this.registerAdminStatusListener();
        this.checkAdminStatus();
      })
      .catch(() => {
        // Silently fail - SignalR is optional
      });

    // Handle reconnection
    this.hubConnection.onreconnected(() => {
      this.checkAdminStatus();
    });

    this.hubConnection.onclose(() => {
      // Set admin offline when connection closes
      this.adminOnlineStatus.set(false);
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  public reconnectWithAuth(): void {
    console.log('🔄 Reconnecting SignalR with updated auth...');
    this.stopConnection();
    setTimeout(() => {
      this.startConnection();
    }, 500);
  }

  private registerAdminStatusListener(): void {
    if (this.hubConnection) {
      this.hubConnection.on('AdminStatusChanged', (data: { isOnline: boolean }) => {
        console.log('📡 Admin status changed:', data.isOnline ? 'ONLINE ✅' : 'OFFLINE ⭕');
        this.adminOnlineStatus.set(data.isOnline);
      });
    }
  }

  private checkAdminStatus(): void {
    if (this.hubConnection) {
      this.hubConnection.invoke('CheckAdminStatus')
        .then(() => console.log('✅ CheckAdminStatus invoked'))
        .catch(err => console.error('❌ Error invoking CheckAdminStatus:', err));
    }
  }

  public getAdminOnlineStatus(): boolean {
    return this.adminOnlineStatus();
  }
}
