import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/authService/auth.service';

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

  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    if (
      localStorage.getItem('currentUserId') &&
      localStorage.getItem('currentUserUsername')
    ) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.loginForm.reset();
      },
    });
  }
}
