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

  getToken() {
    return localStorage.getItem('token');
  }

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
            this.saveCredentialsInLocalStorage(
              user.id.toString(),
              user.username
            );
            localStorage.setItem('token', token);
          },
          error: () => {
            this.isLoggedIn.next(false);
            this.currentUser.next({ id: -1, username: '' });
            this.clearCredentialsFromLocalStorage();
          },
        })
      );
  }

  register(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:5000/api/user/register', {
        username: request.username,
        password: request.password,
      })
      .pipe(
        tap({
          next: ({ user }) => {
            this.isLoggedIn.next(true);
            this.currentUser.next({ id: user.id, username: user.username });
            this.saveCredentialsInLocalStorage(
              user.id.toString(),
              user.username
            );
            // localStorage.setItem('token', token);
          },
          error: () => {
            this.isLoggedIn.next(false);
            this.currentUser.next({ id: -1, username: '' });
            this.clearCredentialsFromLocalStorage();
          },
        })
      );
  }

  logout() {
    this.clearCredentialsFromLocalStorage();
    this.currentUser.next({ id: -1, username: '' });
    this.isLoggedIn.next(false);
  }

  private saveCredentialsInLocalStorage(id: string, username: string) {
    localStorage.setItem('currentUserUsername', username);
    localStorage.setItem('currentUserId', id);
  }

  clearCredentialsFromLocalStorage() {
    localStorage.removeItem('currentUserUsername');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('token');
  }
}
