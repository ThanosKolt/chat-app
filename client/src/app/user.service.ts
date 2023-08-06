import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:5000/api/user/login',
      {
        username: request.username,
        password: request.password,
      }
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/user');
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`http://localhost:5000/api/user/${id}`);
  }
  searchUsers(input: string): Observable<User[]> {
    return this.http.post<User[]>(`http://localhost:5000/api/user/search`, {
      input,
    });
  }
}
