import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {

  constructor() {
    console.log('signalR connection started...');
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:60900/chat')
      .build();
    connection.on('broadcastMessage', data => {
      console.log(data);
    });
    connection.start()
      .then(() => connection.invoke('Send', 'Angular', 'Hello'));
  }
}
