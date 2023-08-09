import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/types';
import { UserService } from '../../shared/userService/user.service';
import { AuthService } from 'src/app/shared/authService/auth.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent {
  @Output()
  showSidebarEvent = new EventEmitter<boolean>();

  showSidebar: boolean = false;

  users: User[] = [];
  input: string = '';
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  searchUser() {
    this.userService.searchUsers(this.input).subscribe((users) => {
      if (this.input === '') {
        this.users = [];
        return;
      }
      this.users = users.filter(
        (user) => user.id !== Number(localStorage.getItem('currentUserId'))
      );
    });
  }

  toggleShowSidebar() {
    this.showSidebar = !this.showSidebar;
    this.users = [];
    this.input = '';
    this.showSidebarEvent.emit(this.showSidebar);
  }
}
