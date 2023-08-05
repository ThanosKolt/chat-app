import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { GetRoomInfoResponse, GetRoomsByUserReponse } from 'src/types';
import { Message } from '../types';

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
  baseUrl = 'http://localhost:5000/api/';

  newMessage = new Subject<Message>();

  constructor(private http: HttpClient) {}

  socket = io('http://localhost:5000');

  public getRoomMessages(roomId: string) {
    return this.http.post<Message[]>(this.baseUrl + 'message/getRoomMessages', {
      roomId,
    });
  }

  public sendMessage(message: Message) {
    this.socket.emit('message', message);
    return this.http.post(this.baseUrl + 'message/send', {
      roomId: message.roomId,
      senderId: message.fromId,
      text: message.text,
    });
  }

  public getNewMessage() {
    this.socket.on('message', (newMessage: Message) => {
      this.newMessage.next(newMessage);
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
    return this.http.post<{ roomId: number }>(this.baseUrl + 'chat/create', {
      userAId,
      userBId,
    });
  }

  public getRoomId(
    userAId: number,
    userBId: number
  ): Observable<{ roomId: number }> {
    return this.http.post<{ roomId: number }>(this.baseUrl + 'chat/getRoomId', {
      userAId,
      userBId,
    });
  }

  public getRoomsByUser(userId: number): Observable<GetRoomsByUserReponse[]> {
    return this.http.post<GetRoomsByUserReponse[]>(
      this.baseUrl + 'chat/getRoomsByUser',
      {
        userId,
      }
    );
  }

  public getRoomInfo(roomId: string): Observable<GetRoomInfoResponse> {
    return this.http.post<GetRoomInfoResponse>(
      this.baseUrl + 'chat/getRoomInfo',
      {
        roomId,
      }
    );
  }
}
