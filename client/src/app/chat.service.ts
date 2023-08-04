import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { GetRoomsByUserReponse } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // public message$ = new BehaviorSubject('');

  // public message$ = new Observable<string>((subscriber) => {
  //   this.socket.on('message', (message) => {
  //     subscriber.next(message);
  //   });
  // });

  // public newMessage = new Subject<string>();
  baseUrl = 'http://localhost:5000/api/chat/';
  newMessage = new Subject<string>();

  constructor(private http: HttpClient) {}

  socket = io('http://localhost:5000');

  public sendMessage(roomId: string, message: string) {
    this.socket.emit('message', roomId, message);
  }

  public getNewMessage() {
    this.socket.on('message', (message) => {
      this.newMessage.next(message);
    });

    return this.newMessage;
  }

  public joinRoom(roomId: string) {
    this.socket.emit('joinRoom', roomId);
  }

  public createChatRoom(
    userAId: number,
    userBId: number
  ): Observable<{ roomId: number }> {
    return this.http.post<{ roomId: number }>(this.baseUrl + 'create', {
      userAId,
      userBId,
    });
  }

  public getRoomId(
    userAId: number,
    userBId: number
  ): Observable<{ roomId: number }> {
    return this.http.post<{ roomId: number }>(this.baseUrl + 'getRoomId', {
      userAId,
      userBId,
    });
  }

  public getRoomsByUser(userId: number): Observable<GetRoomsByUserReponse[]> {
    return this.http.post<GetRoomsByUserReponse[]>(
      this.baseUrl + 'getRoomsByUser',
      {
        userId,
      }
    );
  }
  // public getNewMessage() {
  // this.socket.on('message', (message) => {
  // this.message$.next(message);
  // });

  // return this.message$.asObservable();
  // return this.message$;
  // }
}
