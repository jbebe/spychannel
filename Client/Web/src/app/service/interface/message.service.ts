import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  public onSelectUser: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }
}
