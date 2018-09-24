import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {

  constructor() {
    console.log('signalR connection started...');
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:44325/chat')
      .build();
    connection.on('send', data => {
      console.log(data);
    });
    connection.start()
      .then(() => connection.invoke('SendMessage', 'Hello'));
  }
}
