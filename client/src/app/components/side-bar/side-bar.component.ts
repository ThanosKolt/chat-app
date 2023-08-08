import { Component } from '@angular/core';
import { User } from 'src/types';
import { UserService } from '../../shared/userService/user.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent {
  users: User[] = [];
  input: string = '';

  constructor(private userService: UserService) {}

  searchUser() {
    this.userService.searchUsers(this.input).subscribe((users) => {
      if (this.input === '') {
        this.users = [];
        return;
      }
      this.users = users;
    });
  }
}
