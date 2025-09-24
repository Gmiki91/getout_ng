import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private client: Client;
  private messages: ChatMessage[]=[];

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8000/ws',
      webSocketFactory: () => new SockJS('http://localhost:8000/ws'),
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/chat', (msg: IMessage) => {
        const message:ChatMessage = JSON.parse(msg.body);
        this.messages.push(message);
      });
    };

    this.client.activate();
  }
  getMessages() {
    return this.messages;
  }

  sendMessage(message: ChatMessage) {
    this.client.publish({ destination: '/app/chat', body: JSON.stringify(message) });
  }
}
