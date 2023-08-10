import { Component } from '@angular/core';
import { AuthService } from './shared/authService/auth.service';
import { Route, Router } from '@angular/router';
import { ChatService } from './shared/chatService/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showSidebar: boolean = false;

  title = 'chat-app';

  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnDestroy() {
    this.chatService.removeListeners();
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((value) => {
      this.isLoggedIn = value;
    });

    this.chatService.getNewMessage().subscribe();
  }

  toggleSidebar(value: boolean) {
    this.showSidebar = value;
  }
}
