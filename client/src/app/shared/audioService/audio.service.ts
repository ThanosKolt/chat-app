import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor() {}

  playMessageNotification() {
    let audio = new Audio();
    audio.src = '../../../assets/message_notification.mp3';
    audio.load();
    audio.play();
  }
}
