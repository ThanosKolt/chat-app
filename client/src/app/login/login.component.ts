import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: '',
    password: '',
  });

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  onSubmit(): void {
    this.userService.login(this.loginForm.value).subscribe({
      next: ({ user }) => {
        localStorage.setItem('currentUserUsername', user.username);
        localStorage.setItem('currentUserId', user.id.toString());
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err.message);
        this.loginForm.reset();
      },
    });
  }
}
