import { Injectable } from '@angular/core';
import { WebSocketEventHandlers } from '../../entity/websocket';

const SERVER_URL = 'ws://localhost:51251/ws';

@Injectable()
export class WebSocketService {

  public socket: WebSocket;

  constructor() {
    console.log('Who the fuck called this prematurely?');
  }

  public connect(connectionString: string, handlers: WebSocketEventHandlers) {
    connectionString = SERVER_URL;
    if (!!this.socket) {
      return;
    }
    this.socket = new WebSocket(connectionString);
    this.socket.onopen = handlers.onOpen || (() => {});
    this.socket.onmessage = handlers.onMessage || (() => {});
    this.socket.onclose = handlers.onClosed || (() => {});
    this.socket.onerror = handlers.onError || (() => {});
  }

  public send(message: string): void {
    this.socket.send(message);
  }

}
