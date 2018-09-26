import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFailure, LoginInfo } from '../../model/login';
import { SessionService } from '../session/session.service';

@Injectable()
export class LoginService {

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) { }

  async login(loginInfo: LoginInfo): Promise<LoginFailure | null> {
    if (!!loginInfo.name) {
      await this.sessionService.create(loginInfo);
      await this.router.navigate(['chat']);
      return null;
    } else {
      return new LoginFailure('Invalid username!');
    }
  }

}
