import { EventEmitter, Injectable } from '@angular/core';
import { UserEntity } from '../../model/chat';

@Injectable()
export class MessageService {

  public onSelectUser: EventEmitter<UserEntity> = new EventEmitter<UserEntity>();
  public onNewMessage: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }
}
