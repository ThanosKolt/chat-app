import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { User } from 'src/types';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent {
  currentUserId: number = -1;
  users: User[] = [];

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUsers();
    if (localStorage.getItem('currentUserId') !== null) {
      this.currentUserId = Number(localStorage.getItem('currentUserId'))!;
    }
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.log(error.message);
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
          this.createRoom(userAId, userBId);
          return;
        }
        console.error(error.message);
      },
    });
  }

  createRoom(userAId: number, userBId: number) {
    this.chatService.createChatRoom(userAId, userBId).subscribe({
      next: ({ roomId }) => {
        this.router.navigate(['/chat/', roomId]);
      },
      error: (error) => console.error(error.message),
    });
  }
}
