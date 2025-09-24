import { Component,inject } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../models/chat-message.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports:[FormsModule]
})
export class ChatComponent {
  userService = inject(UserService);
  text = '';
  user = this.userService.user;
  chatService = inject(ChatService);
  send() {
    if (this.text.trim()) {
      const msg: ChatMessage = {
        sender: this.user().name,
        message: this.text
      };
      this.chatService.sendMessage(msg);
      this.text = '';
    
    }
  }
}
