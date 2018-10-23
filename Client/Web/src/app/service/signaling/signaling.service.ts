import { EventEmitter, Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { environment } from '../../../environments/environment';
import { EventHandlerType } from '../../utils/signaling';
import { UserEntity } from '../../model/chat';
import { RemoteAction, RemoteFunction } from '../../utils/decorator/remote-call.decorator';
import { SubscribeProxyHandler, UnsubscribeAllProxyHandler, UnsubscribeProxyHandler } from './subscribe.handlers';

interface IEventHandlerList {
  [eventName: string]: EventHandlerType[];
}

@Injectable({
  providedIn: 'root'
})
export class SignalingService {

  // static callbacks (can't put in constructor because DI)

  public static OnInitComplete: EventEmitter<void> = new EventEmitter<void>();
  public static OnInitError: EventEmitter<any> = new EventEmitter<any>();

  private static readonly EventPrefix = 'On';

  private connection: HubConnection;

  // event handling

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

  // actual service logic

  constructor() {
    this.InitSignalR()
      .then(() => SignalingService.OnInitComplete.emit(),
        (reason) => SignalingService.OnInitError.emit(reason))
      .catch((reason) => SignalingService.OnInitError.emit(reason));
  }

  private async InitSignalR() {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.signalServer.endpointUrl)
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

  // events to register on

  public OnUserConnected(user: UserEntity) {
  }

  public OnUserDisconnected(user: UserEntity) {
  }

  public OnRequestSdpExchange(hostId: string, hostSdpHeader: string) {
  }

  public OnRespondToSdpExchange(guestId: string, guestSdpHeader: RTCSessionDescriptionInit) {
  }

  // remote calls

  @RemoteAction()
  public async RegisterAsync(user: UserEntity) {
  }

  /**
   * @description Calls the server, the server calls the guest.
   * @param guestId The id where the message is directed at
   * @param hostSdpHeader The host's sdp header
   */
  @RemoteAction()
  // @ts-ignore
  public async RequestSdpExchangeAsync(guestId: string, hostSdpHeader: RTCSessionDescriptionInit) {
  }

  /**
   * @description Calls the server, the server calls the host.
   * After that, the WebRTC connection will be eventually alive.
   * @param hostId The id where the message is directed at
   * @param guestSdpHeader The guest's sdp answer
   */
  @RemoteAction()
  public async RespondToSdpExchangeAsync(hostId: string, guestSdpHeader: RTCSessionDescriptionInit) {
  }

}
