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
    this.users = [];
    this.userService.searchUsers(this.input).subscribe((users) => {
      users.forEach((user) => {
        this.users.push(user);
      });
    });
    this.input = '';
  }
}
