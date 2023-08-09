import { Component, Input } from '@angular/core';
import { GetRoomsByUserReponse, User } from 'src/types';
import { ChatService } from '../../shared/chatService/chat.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/authService/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent {
  currentUserId: number = -1;
  currentUserUsername: string = '';
  currentUserSub: Subscription = new Subscription();
  @Input() users: User[] = [];
  list: {
    roomId: number;
    user: { id: number; username: string };
    lastMessage: string;
  }[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }

  ngOnInit() {
    if (localStorage.getItem('currentUserId') !== null) {
      this.currentUserId = Number(localStorage.getItem('currentUserId'))!;
      this.currentUserSub = this.authService.currentUser.subscribe((user) => {
        this.currentUserId = user.id;
        this.currentUserUsername = user.username;
      });
      if (!this.users) {
        this.getList();
      }
    }
  }

  getList() {
    this.chatService.getRoomsByUser(this.currentUserId).subscribe({
      next: (data) => {
        data.forEach((room) => {
          this.chatService
            .getRoomMessages(room.roomId.toString())
            .subscribe((messages) => {
              let formatLastMessage = '';
              let lastMessage = messages[messages.length - 1];
              if (lastMessage.fromId === this.currentUserId) {
                formatLastMessage = `You wrote: ${lastMessage.text}`;
              } else {
                formatLastMessage = `${room.user.username} wrote: ${lastMessage.text}`;
              }
              this.list.push({
                roomId: room.roomId,
                user: { id: room.user.id, username: room.user.username },
                lastMessage: formatLastMessage,
              });
            });
        });
      },
    });
  }

  getChatRoomId(userAId: number, userBId: number) {
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
