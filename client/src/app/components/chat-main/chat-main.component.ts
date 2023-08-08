import {
  Component,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../shared/chatService/chat.service';
import { Message } from 'src/types';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
})
export class ChatMainComponent {
  // @Input('id')
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

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
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
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') !== null) {
        this.roomId = paramMap.get('id')!;
        this.chatService.joinRoom(this.roomId);
        const getRoomMessageSub = this.chatService
          .getRoomMessages(this.roomId)
          .subscribe((data) => {
            this.messageList = [];
            data.forEach((message) => this.messageList.push(message));
          });
        this.subscriptions.push(getRoomMessageSub);
      }
    });
    const newMessageSub = this.chatService
      .getNewMessage()
      .subscribe((message) => {
        this.messageList.push(message);
      });

    this.subscriptions.push(newMessageSub);

    if (
      localStorage.getItem('currentUserId') !== null &&
      localStorage.getItem('currentUserUsername') !== null
    ) {
      this.currentUserId = Number(localStorage.getItem('currentUserId'));
      this.currentUserUsername = localStorage.getItem('currentUserUsername')!;
    }

    this.getToUserId();
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
