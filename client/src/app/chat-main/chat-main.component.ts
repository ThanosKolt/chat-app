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

  toUser: {
    id: number;
    username: string;
  } = { id: -1, username: '' };
  currentUserId: number = -1;
  currentUserUsername: string = '';
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
    if (
      localStorage.getItem('currentUserId') !== null &&
      localStorage.getItem('currentUserUsername') !== null
    ) {
      this.currentUserId = Number(localStorage.getItem('currentUserId'));
      this.currentUserUsername = localStorage.getItem('currentUserUsername')!;
    }

    this.getToUserId();
  }

  sendMessage() {
    if (this.newMessage.trim().length > 0 && this.roomId !== undefined) {
      this.chatService.sendMessage(
        this.roomId,
        this.currentUserId,
        this.toUser.id,
        this.newMessage
      );
      console.log(this.roomId);
    }
    this.newMessage = '';
  }

  getToUserId() {
    if (this.roomId !== undefined) {
      this.chatService.getRoomInfo(this.roomId).subscribe({
        next: (data) => {
          data.users.forEach((user) => {
            if (user.id !== this.currentUserId) {
              this.toUser.id = user.id;
              this.toUser.username = user.username;
            }
          });
        },
      });
    }
  }
}
