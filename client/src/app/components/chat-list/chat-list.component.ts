import { Component, Input } from '@angular/core';
import { GetRoomsByUserReponse, Message, User } from 'src/types';
import { ChatService } from '../../shared/chatService/chat.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/authService/auth.service';
import { Subscription, of } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent {
  @Input() users: User[] = [];

  currentUser: User = { id: -1, username: '' };
  currentUserSub: Subscription = new Subscription();
  list: {
    user: User;
    roomId?: number;
    lastMessage?: string;
  }[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }

  ngOnChanges() {
    this.list = [];
    if (this.users) {
      this.users.forEach((user) => {
        this.list.push({ user });
      });
    }
  }

  ngOnInit() {
    this.currentUserSub = this.authService.currentUser.subscribe((user) => {
      this.currentUser.id = user.id;
      this.currentUser.username = user.username;
    });
    if (!this.users) {
      this.getActiveRooms();
    } else {
      this.users.forEach((user) => {
        this.list.push({ user });
      });
    }
  }

  getActiveRooms() {
    this.chatService.getRoomsByUser(this.currentUser.id).subscribe((rooms) => {
      rooms.forEach((room) => {
        this.list.push({
          user: { id: room.user.id, username: room.user.username },
          roomId: room.roomId,
        });
      });
      this.populateListWithLastMessage();
    });
  }

  populateListWithLastMessage() {
    this.list.forEach((room) => {
      this.chatService
        .getRoomMessages(room.roomId!.toString())
        .subscribe((messages) => {
          let formatLastMessage = '';
          let lastMessage = messages[messages.length - 1];
          if (lastMessage.fromId === this.currentUser.id) {
            formatLastMessage = `You wrote: ${lastMessage.text}`;
          } else {
            formatLastMessage = `${room.user.username} wrote: ${lastMessage.text}`;
          }
          room.lastMessage = formatLastMessage;
        });
    });
  }

  getChatRoom(userAId: number, userBId: number) {
    this.chatService.getRoomId(userAId, userBId).subscribe({
      next: ({ roomId }) => {
        this.router.navigate(['/chat/', roomId]);
      },
      error: (error) => {
        if (error.status === 404) {
          this.chatService.createChatRoom(userAId, userBId).subscribe({
            next: ({ roomId }) => {
              this.router.navigate(['/chat/', roomId]);
            },
            error: (error) => console.error(error.message),
          });
        }
      },
    });
  }
}
