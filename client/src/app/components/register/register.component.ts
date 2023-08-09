import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/authService/auth.service';
import { UserService } from 'src/app/shared/userService/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  showPassword: boolean = false;

  registerForm = this.formBuilder.group({
    username: '',
    password: '',
    confirmPassword: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (
      this.registerForm.value.confirmPassword ===
      this.registerForm.value.password
    ) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.registerForm.reset();
        },
      });
    }
  }
}
