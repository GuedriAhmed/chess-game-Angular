import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client!: Client;
  public onlinePlayers$ = new BehaviorSubject<string[]>([]);

  connect(username: string) {
    this.client = new Client();

    this.client.webSocketFactory = () => new SockJS('http://localhost:8080/ws');

    this.client.onConnect = () => {
      console.log('Connected via WebSocket');

      // Subscribe to online players list
      this.client.subscribe('/topic/players', (message: Message) => {
        const players = JSON.parse(message.body) as string[];
        this.onlinePlayers$.next(players);
      });

      // Announce yourself
      this.announceOnline(username);
    };

    this.client.activate();
  }

  announceOnline(username: string) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/online',
        body: username
      });
    }
  }

  sendMove(move: { rowFrom: number; colFrom: number; rowTo: number; colTo: number }) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/move',
        body: JSON.stringify(move)
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }
}
