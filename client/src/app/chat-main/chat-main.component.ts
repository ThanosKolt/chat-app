import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { User } from 'src/types';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
})
export class ChatMainComponent {
  @Input('id') roomId?: string;

  toUser: User | undefined;
  newMessage: string = '';
  messageList: string[] = [];

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.chatService.getNewMessage().subscribe((message) => {
      this.messageList.push(message);
    });
    if (this.roomId !== undefined) {
      this.chatService.joinRoom(this.roomId);
    }

    console.log(this.roomId);
  }

  sendMessage() {
    if (this.newMessage.trim().length > 0 && this.roomId !== undefined) {
      this.chatService.sendMessage(this.roomId, this.newMessage);
      console.log(this.roomId);
    }
    this.newMessage = '';
  }
}
