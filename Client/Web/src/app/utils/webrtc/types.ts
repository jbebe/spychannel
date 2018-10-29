import { EventEmitter } from '@angular/core';
import { DataChannelEventData } from '../../model/chat';

export class DataChannelConfig {

  constructor(
    public name: string,
    public onMessage: EventEmitter<DataChannelEventData>,
    public onOpen: EventEmitter<Event> = new EventEmitter<Event>(),
    public options?: RTCDataChannelInit
  ) {
  }
}

export interface IRequestedMedia {
  camera?: MediaStreamConstraints;
  screen?: MediaStreamConstraints;
}
