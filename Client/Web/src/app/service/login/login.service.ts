import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFailure, LoginInfo } from '../../entity/login';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private router: Router,
    private globalService: GlobalService
  ) { }

  async login(loginInfo: LoginInfo): Promise<LoginFailure | null> {
    if (!!loginInfo.name) {
      this.globalService.loginInfo = loginInfo;
      await this.router.navigate(['chat']);
      return null;
    } else {
      return new LoginFailure('Invalid username!');
    }
  }

}
