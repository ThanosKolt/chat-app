import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chat-app';

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((value) => {
      this.isLoggedIn = value;
    });
  }
}
