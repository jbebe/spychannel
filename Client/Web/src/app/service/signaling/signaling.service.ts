import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { environment } from '../../../environments/environment';
import { Assert } from '../../utils/assert';

function RemoteCall() {
  return (methodObj, methodName: string, descriptor: PropertyDescriptor) => {
    Assert.True(methodName.endsWith('Async'));
    const remoteMethodName = methodName.substr(0, methodName.length - 'Async'.length);
    descriptor.value = async function (...args: any[]): Promise<any> {
      return await this.connection.invoke(
        remoteMethodName,
        ...args.map((e) => {
          if (typeof(e) === 'object') {
            return JSON.stringify(e);
          } else {
            return e;
          }
        }));
    };
  };
}

type EventHandlerType = (...args: any[]) => void;

interface IEventHandlerList {
  [eventName: string]: EventHandlerType[];
}

class SubscribeProxyHandler implements ProxyHandler<SignalingService> {

  set(target: SignalingService, propertyKey: string, eventHandler: EventHandlerType, receiver: any): boolean {
    target.eventHandlers[propertyKey] = target.eventHandlers[propertyKey] || <EventHandlerType[]>[];
    target.eventHandlers[propertyKey].push(eventHandler);
    return true;
  }
}

class UnsubscribeProxyHandler implements ProxyHandler<SignalingService> {

  set(target: SignalingService, propertyKey: string, removableEventHandler: EventHandlerType, receiver: any): boolean {
    if (!target.eventHandlers[propertyKey]) {
      return false;
    }
    target.eventHandlers[propertyKey] = target.eventHandlers[propertyKey]
      .filter((eventHandler) => eventHandler === eventHandler);
    return true;
  }
}

class UnsubscribeAllProxyHandler implements ProxyHandler<SignalingService> {

  get(target: SignalingService, propertyKey: string, receiver: any): any {
    if (!target.eventHandlers[propertyKey]) {
      return;
    }
    target.eventHandlers[propertyKey] = [];
  }

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

  constructor() {
    console.log('INIT SIGNALR');
    this.InitSignalR();
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
    // connection.invoke('Send', 'Angular', 'Hello')
  }

  public OnUserConnected(username: string) {
  }

  @RemoteCall()
  public async RegisterNewUserAsync(username: string) {
  }

  @RemoteCall()
  public async GetAllUserAsync(): Promise<string[]> {
    return null;
  }

}
