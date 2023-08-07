import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject(false);
  currentUser: BehaviorSubject<User> = new BehaviorSubject({
    id: -1,
    username: '',
  });

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:5000/api/user/login', {
        username: request.username,
        password: request.password,
      })
      .pipe(
        tap({
          next: ({ token, user }) => {
            this.isLoggedIn.next(true);
            this.currentUser.next({ id: user.id, username: user.username });
            localStorage.setItem('currentUserUsername', user.username);
            localStorage.setItem('currentUserId', user.id.toString());
            localStorage.setItem('token', token);
          },
          error: () => {
            this.isLoggedIn.next(false);
            this.currentUser.next({ id: -1, username: '' });
            localStorage.removeItem('currentUserUsername');
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('token');
          },
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUserUsername');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('token');
    this.currentUser.next({ id: -1, username: '' });
    this.isLoggedIn.next(false);
  }
}
