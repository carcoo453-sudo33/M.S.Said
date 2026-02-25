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
    const token = localStorage.getItem('token');
    
    const options: signalR.IHttpConnectionOptions = {
      skipNegotiation: false,
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
    };

    // Only add token if it exists (for admin)
    if (token) {
      options.accessTokenFactory = () => token;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/notifications`, options)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR Connected successfully');
        this.registerAdminStatusListener();
        this.checkAdminStatus();
      })
      .catch(err => {
        console.error('❌ Error while starting SignalR connection:', err);
        console.error('Hub URL:', `${environment.apiUrl.replace('/api', '')}/hubs/notifications`);
      });

    // Handle reconnection
    this.hubConnection.onreconnected(() => {
      console.log('🔄 SignalR Reconnected');
      this.checkAdminStatus();
    });

    this.hubConnection.onclose(() => {
      console.log('🔌 SignalR Connection closed');
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
