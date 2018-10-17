import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { environment } from '../../../environments/environment';
import { EventHandlerType } from '../../utils/signaling';
import { UserEntity } from '../../model/chat';
import { RemoteAction, RemoteFunction } from './remote-call.decorator';
import { SubscribeProxyHandler, UnsubscribeAllProxyHandler, UnsubscribeProxyHandler } from './subscribe.handlers';

interface IEventHandlerList {
  [eventName: string]: EventHandlerType[];
}

@Injectable({
  providedIn: 'root'
})
export class SignalingService {

  private static readonly EventPrefix = 'On';

  private connection: HubConnection;

  public eventHandlers: IEventHandlerList = {};

  public get subscribe() {
    return new Proxy(this, new SubscribeProxyHandler());
  }

  public get unsubscribe() {
    return new Proxy(this, new UnsubscribeProxyHandler());
  }

  public get unsubscribeAll() {
    return new Proxy(this, new UnsubscribeAllProxyHandler());
  }

  constructor(onInitComplete?: () => void, onInitError?: (reason) => void) {
    this.InitSignalR().then(onInitComplete, onInitError);
  }

  private async InitSignalR() {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.signalServerEndpoint)
      .build();

    // init events
    Object.getOwnPropertyNames(SignalingService.prototype)
      .filter(methodName => methodName.startsWith(SignalingService.EventPrefix))
      .forEach(methodName => {
        const eventName = methodName.slice(SignalingService.EventPrefix.length);
        this.connection.on(eventName, (...args: any[]) => {
          (this.eventHandlers[methodName] || [])
            .forEach((eventHandler) => eventHandler(...args));
        });
      });

    // start signalR
    await this.connection.start();
  }

  public OnUserConnected(user: UserEntity) {
  }

  public OnUserDisconnected(user: UserEntity) {
  }

  @RemoteAction()
  public async RegisterAsync(user: UserEntity) {
  }

  @RemoteFunction()
  // @ts-ignore
  public async ExchangeSdpAsync(userId: string, sdpHeader: string): Promise<string> {
  }

}
