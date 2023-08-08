import { Component, Input } from '@angular/core';
import { GetRoomsByUserReponse, User } from 'src/types';
import { ChatService } from '../../shared/chatService/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent {
  currentUserId: number = -1;
  @Input() users: User[] = [];
  list: GetRoomsByUserReponse[] = [];

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('currentUserId') !== null) {
      this.currentUserId = Number(localStorage.getItem('currentUserId'))!;
      if (!this.users) {
        this.getList();
      }
    }
  }

  getList() {
    this.chatService.getRoomsByUser(this.currentUserId).subscribe({
      next: (data) => {
        this.list = data;
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
