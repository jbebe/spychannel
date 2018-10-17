import { EventHandlerType } from '../../utils/signaling';
import { SignalingService } from './signaling.service';

export class SubscribeProxyHandler implements ProxyHandler<SignalingService> {

  set(target: SignalingService, propertyKey: string, eventHandler: EventHandlerType, receiver: any): boolean {
    target.eventHandlers[propertyKey] = target.eventHandlers[propertyKey] || <EventHandlerType[]>[];
    target.eventHandlers[propertyKey].push(eventHandler);
    return true;
  }
}

export class UnsubscribeProxyHandler implements ProxyHandler<SignalingService> {

  set(target: SignalingService, propertyKey: string, removableEventHandler: EventHandlerType, receiver: any): boolean {
    if (!target.eventHandlers[propertyKey]) {
      return false;
    }
    target.eventHandlers[propertyKey] = target.eventHandlers[propertyKey]
      .filter((eventHandler) => eventHandler === eventHandler);
    return true;
  }
}

export class UnsubscribeAllProxyHandler implements ProxyHandler<SignalingService> {

  get(target: SignalingService, propertyKey: string, receiver: any): any {
    if (!target.eventHandlers[propertyKey]) {
      return;
    }
    target.eventHandlers[propertyKey] = [];
  }
}
