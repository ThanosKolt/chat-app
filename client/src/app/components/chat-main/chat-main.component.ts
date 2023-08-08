import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChatService } from '../../shared/chatService/chat.service';
import { Message } from 'src/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
})
export class ChatMainComponent {
  @Input('id')
  roomId?: string;

  @ViewChild('form')
  formElement?: ElementRef<HTMLFormElement>;

  @ViewChild('chatDiv')
  chatDiv?: ElementRef<HTMLDivElement>;

  toUser: {
    id: number;
    username: string;
  } = { id: -1, username: '' };
  currentUserId: number = -1;
  currentUserUsername: string = '';
  newMessage: string = '';
  messageList: Message[] = [];
  subscriptions: Subscription[] = [];
  constructor(private chatService: ChatService) {}

  ngAfterViewChecked() {
    this.updateScroll();
  }

  updateScroll() {
    if (this.chatDiv !== undefined) {
      this.chatDiv.nativeElement.scrollTop =
        this.chatDiv.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    this.chatService.removeListeners();
  }

  ngOnInit() {
    const newMessageSub = this.chatService
      .getNewMessage()
      .subscribe((message) => {
        this.messageList.push(message);
      });

    if (this.roomId !== undefined) {
      this.chatService.joinRoom(this.roomId);
      const getRoomMessageSub = this.chatService
        .getRoomMessages(this.roomId)
        .subscribe((data) => {
          data.forEach((message) => this.messageList.push(message));
        });

      this.subscriptions.push(newMessageSub, getRoomMessageSub);
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
    this.updateScroll();
    if (this.newMessage.trim().length > 0 && this.roomId !== undefined) {
      const sendMessageSub = this.chatService
        .sendMessage({
          roomId: this.roomId,
          fromId: this.currentUserId,
          toId: this.toUser.id,
          text: this.newMessage,
        })
        .subscribe(() => console.log('subbed to sendmessage'));
      this.subscriptions.push(sendMessageSub);
    }
    this.newMessage = '';
  }

  getToUserId() {
    if (this.roomId !== undefined) {
      const getRoomInfoSub = this.chatService
        .getRoomInfo(this.roomId)
        .subscribe({
          next: (data) => {
            data.users.forEach((user) => {
              if (user.id !== this.currentUserId) {
                this.toUser.id = user.id;
                this.toUser.username = user.username;
              }
            });
          },
        });
      this.subscriptions.push(getRoomInfoSub);
    }
  }
}
