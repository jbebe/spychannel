import { Injectable } from '@angular/core';
import { LoginInfo } from '../../model/login';
import { SignalingService } from '../signaling/signaling.service';
import { UserEntity } from '../../model/chat';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public currentUser: UserEntity;

  constructor(
    private signalingService: SignalingService
  ) {
  }

  async create(loginInfo: LoginInfo) {
    const isoDate = new Date().toISOString();
    this.currentUser = new UserEntity(loginInfo.name, isoDate);
    await this.signalingService.RegisterAsync(this.currentUser);
  }
}
