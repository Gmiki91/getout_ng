import { Component,inject } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports:[FormsModule]
})
export class ChatComponent {
  text = '';
  username = 'Guest' + Math.floor(Math.random() * 1000);
  chatService = inject(ChatService);
  send() {
    if (this.text.trim()) {
      const msg: ChatMessage = {
        sender: this.username,
        content: this.text
      };
      //this.chatService.sendMessage(msg);
      this.text = '';
    
    }
  }
}
