import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message, NewMessageData } from '../models/message.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Visitor } from '../models/user.model';
import { UserService } from './user.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private url = environment.url + 'messages';
  private client!: Client;
  private collapsed = signal(true);
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private stateService = inject(StateService);
  private conversations = signal<Map<string, Message[]>>(new Map());
  receiver = signal<Visitor>({} as Visitor);
  chatRequested = computed(() => this.receiver().id !== undefined);
  chatCollapsed = this.collapsed.asReadonly();

  // update private conversation when new message is sent
  conversation = (receiverId: string) =>
    computed(() => {
      const key = this.getKey(this.userService.user().id, receiverId);
      return this.conversations().get(key) ?? [];
    });

  // connect to Websocket server when user is available
  constructor() {
    effect(() => {
      const user = this.userService.user();
      if (user?.id) {
        this.connect(user.id);
      }
    });
  }
  connect(userId: string) {
    this.client = new Client({
      brokerURL: 'ws://localhost:8000/ws',
      webSocketFactory: () => new SockJS('http://localhost:8000/ws'),
      reconnectDelay: 5000,
      connectHeaders: {
        userId: userId || '', 
      },
    });

    this.client.onConnect = () => {
      this.client.subscribe('/user/queue/messages', (msg: IMessage) => {
        const message: Message = JSON.parse(msg.body);
        const key = this.getKey(message.sender.id, message.receiver.id);
        this.conversations.update((map) => {
          const arr = map.get(key) ?? [];
          map.set(key, [...arr, message]);
          return new Map(map);
        });
      });
    };
    this.client.activate();
  }

  getReceiver() {
    return this.receiver();
  }

  setConversationHistory(receiverId: string) {
    this.http
      .get<Message[]>(`${this.url}/private/${receiverId}`)
      .subscribe((history) =>
        this.conversations.update((convMap) => {
          console.log(history)
          const key = this.getKey(this.userService.user().id, receiverId);
          convMap.set(key, history);
          return new Map(convMap);
        })
      );
  }

  setReceiver(receiver: Visitor) {
    this.receiver.set(receiver);
    this.setConversationHistory(receiver.id);
    this.stateService.activateChat();
    this.openChatWindow();
  }

  sendMessage(message: NewMessageData) {
    this.client.publish({
      destination: '/app/private-message',
      body: JSON.stringify(message),
    });

    const key = this.getKey(this.userService.user().id, message.receiverId);
    this.conversations.update((map) => {
      const arr = map.get(key) ?? [];
      arr.push({
        ...message,
        sender: this.userService.user(),
        receiver: this.receiver(),
        isRead: false,
        id: 'temp',
        timestamp: new Date().toISOString(),
      });
      map.set(key, arr);
      return new Map(map);
    });
  }

  openChatWindow(){
    this.collapsed.set(false);
  }
  toggleChatWindow() {
    this.collapsed.update(() => (this.collapsed() === true ? false : true));
  }

  disconnect() {
    this.client.deactivate(); // Close the connection. This also unsubscribes from all subscriptions.
  }

  private getKey(userId1: string, userId2: string) {
    return [userId1, userId2].sort().join('_');
  }
}
