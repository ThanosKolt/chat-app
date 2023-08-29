import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../authService/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              // redirect will probably change to modal in the future
              this.router.navigate(['/login']);
              this.authService.isLoggedIn.next(false);
              this.authService.clearCredentialsFromLocalStorage();
            }
          }
        },
      })
    );
  }
}
