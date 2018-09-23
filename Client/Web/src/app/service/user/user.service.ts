import { Injectable } from '@angular/core';
import { ChatUserInfo } from '../../entity/chat';
import { WebSocketService } from '../websocket/websocket.service';
import { ApiService } from '../api/api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private wsService: WebSocketService;

  // calls our wsService connect method
  constructor(
    private api: ApiService,
    private ws: WebSocketService
  ) {
    this.wsService = ws;
    this.wsService.connect('', {
      onOpen: () => {
        console.log('opened!');
        this.send('HELLO ECHO!');
      },
      onMessage: (data: MessageEvent) => {
        console.log('new message: ' + data.data);
      },
      onClosed: () => {
        console.log('socket closed.');
      },
      onError: (data) => {
        console.log('new message: ' + data);
      }
    });
  }

  send(msg: string) {
    console.log('outgoing message: ' + msg);
    this.wsService.send(msg);
  }

  async getActiveUsers(): Promise<ChatUserInfo[]> {
    const activeUsers = await this.api.get<ChatUserInfo[]>(['user']);
    return activeUsers;
  }
}
