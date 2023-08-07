import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../authService/auth.service';

export const authguardGuard: CanActivateFn = (route, state) => {
  const username = localStorage.getItem('currentUserUsername');
  const id = Number(localStorage.getItem('currentUserId'));
  if (username && id && localStorage.getItem('token')) {
    let authService = inject(AuthService);
    authService.isLoggedIn.next(true);
    authService.currentUser.next({ id, username });

    return true;
  }
  let isLoggedIn = inject(AuthService).isLoggedIn.getValue();
  if (!isLoggedIn) {
    inject(Router).navigate(['login']);
  }
  return isLoggedIn;
};
