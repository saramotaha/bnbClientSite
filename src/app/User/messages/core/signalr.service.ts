import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Conversation } from '../models/conversation';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection?: signalR.HubConnection;
  private baseUrl = 'http://localhost:7145/chatHub'; // Directly use your API URL
  

  constructor() { }

  public startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
  .withUrl(this.baseUrl, {
    skipNegotiation: false, // Keep negotiation for proper connection
    transport: signalR.HttpTransportType.WebSockets,
    withCredentials: true // This matches the server's AllowCredentials()
  })
  .withAutomaticReconnect()
  .build();

    return this.hubConnection.start();
  }

  public joinConversation(conversationId: number): Promise<void> | undefined {
    return this.hubConnection?.invoke('JoinConversation', conversationId);
  }

  public leaveConversation(conversationId: number): Promise<void> | undefined {
    return this.hubConnection?.invoke('LeaveConversation', conversationId);
  }

  public onReceiveMessage(callback: (message: any) => void): void {
    this.hubConnection?.on('ReceiveMessage', (message) => {
      console.log('SignalR message received:', message); // Debug log
      callback(message);
    }); }

  public onConnectionStatusChanged(callback: (status: string) => void): void {
    this.hubConnection?.onclose(() => callback('disconnected'));
    this.hubConnection?.onreconnected(() => callback('connected'));
  }
}
