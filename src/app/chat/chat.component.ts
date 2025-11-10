import {
  Component,
  inject,
  computed,
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Message, NewMessageData } from '../models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [FormsModule, MatButtonModule, MatIcon],
})
export class ChatComponent {
  userService = inject(UserService);
  chatService = inject(ChatService);
  text = '';
  user = this.userService.user;
  receiver = this.chatService.receiver;
  chatCollapsed = this.chatService.chatCollapsed;
  messages = computed<Message[]>(() => {
    return this.user() && this.receiver() ?this.chatService.conversation(this.receiver().id)() : [];
  });

  send() {
    if (this.text.trim()) {
      const msg: NewMessageData = {
        text: this.text,
        timestamp: new Date().toISOString(),
        senderId: this.user().id,
        receiverId: this.receiver().id,
      };
      this.chatService.sendMessage(msg);
      this.text = '';
    }
  }
  toggleChat() {
    this.chatService.toggleChatWindow();
  }
}
