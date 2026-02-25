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
    // Skip SignalR connection in production if backend doesn't support it yet
    if (environment.production) {
      console.log('⚠️ SignalR disabled in production - backend needs redeployment');
      return;
    }

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
    console.log('🔗 Attempting SignalR connection to:', hubUrl);

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, options)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning) // Reduce logging noise
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR Connected successfully');
        this.registerAdminStatusListener();
        this.checkAdminStatus();
      })
      .catch(err => {
        console.warn('⚠️ SignalR connection failed (non-critical):', err.message);
        // Don't throw - just continue without SignalR
      });

    // Handle reconnection
    this.hubConnection.onreconnected(() => {
      console.log('🔄 SignalR Reconnected');
      this.checkAdminStatus();
    });

    this.hubConnection.onclose(() => {
      console.log('🔌 SignalR Connection closed');
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
