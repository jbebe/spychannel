import { Injectable } from '@angular/core';
import { LoginInfo } from '../../model/login';
import { SignalingService } from '../signaling/signaling.service';
import { ChatUserInfo } from '../../model/chat';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public currentUser: ChatUserInfo;

  constructor(
    private signalingService: SignalingService
  ) {
  }

  async create(loginInfo: LoginInfo) {
    this.currentUser = new ChatUserInfo(loginInfo.name, true);
    await this.signalingService.RegisterAsync(loginInfo.name);
  }
}
