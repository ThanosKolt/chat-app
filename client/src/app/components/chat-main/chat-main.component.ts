import {
  Component,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../shared/chatService/chat.service';
import { Message, User } from 'src/types';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/authService/auth.service';
import { AudioService } from 'src/app/shared/audioService/audio.service';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
})
export class ChatMainComponent {
  roomId?: string;

  @ViewChild('form')
  formElement?: ElementRef<HTMLFormElement>;

  @ViewChild('chatDiv')
  chatDiv?: ElementRef<HTMLDivElement>;

  toUser: User = { id: -1, username: '' };
  currentUser: User = { id: -1, username: '' };
  newMessage: string = '';
  messageList: Message[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private audioService: AudioService
  ) {}

  @HostListener('window:resize', ['$event'])
  updateChatSize() {
    if (
      this.chatDiv?.nativeElement.offsetHeight !== null &&
      this.formElement?.nativeElement.offsetHeight !== null
    ) {
      this.chatDiv!.nativeElement.style.height =
        (
          this.chatDiv!.nativeElement.parentElement!.offsetHeight -
          this.formElement!.nativeElement.offsetHeight
        ).toString() + 'px';
    }
  }

  ngAfterViewChecked() {
    this.updateScroll();
    this.updateChatSize();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    this.chatService.removeListeners();
  }

  ngOnInit() {
    this.joinRoom();
    this.getRoomMessages();
    this.getNewMessage();

    this.authService.currentUser.subscribe((data) => {
      this.currentUser = { id: data.id, username: data.username };
    });

    this.getToUser();
  }

  updateScroll() {
    if (this.chatDiv !== undefined) {
      this.chatDiv.nativeElement.scrollTop =
        this.chatDiv.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    this.updateScroll();
    if (this.newMessage.trim().length > 0 && this.roomId !== undefined) {
      const sendMessageSub = this.chatService
        .sendMessage({
          roomId: this.roomId,
          fromId: this.currentUser.id,
          toId: this.toUser.id,
          text: this.newMessage,
        })
        .subscribe();
      this.subscriptions.push(sendMessageSub);
    }
    this.newMessage = '';
  }

  getToUser() {
    if (this.roomId !== undefined) {
      const getRoomInfoSub = this.chatService
        .getRoomInfo(this.roomId)
        .subscribe({
          next: (data) => {
            data.users.forEach((user) => {
              if (user.id !== this.currentUser.id) {
                this.toUser.id = user.id;
                this.toUser.username = user.username;
              }
            });
          },
        });
      this.subscriptions.push(getRoomInfoSub);
    }
  }

  joinRoom() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') !== null) {
        this.roomId = paramMap.get('id')!;
        this.chatService.joinRoom(this.roomId);
      }
    });
  }

  getRoomMessages() {
    if (this.roomId !== undefined) {
      const getRoomMessageSub = this.chatService
        .getRoomMessages(this.roomId)
        .subscribe((data) => {
          this.messageList = [];
          data.forEach((message) => this.messageList.push(message));
        });
      this.subscriptions.push(getRoomMessageSub);
    }
  }

  getNewMessage() {
    const newMessageSub = this.chatService
      .getNewMessage()
      .subscribe((message) => {
        this.messageList.push(message);
        this.audioService.playMessageNotification();
      });

    this.subscriptions.push(newMessageSub);
  }
}
