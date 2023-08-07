import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authguardGuard: CanActivateFn = (route, state) => {
  let isLoggedIn = inject(AuthService).isLoggedIn.getValue();
  if (!isLoggedIn) {
    inject(Router).navigate(['login']);
  }
  return isLoggedIn;
};
