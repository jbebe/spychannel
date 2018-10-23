import { Component } from '@angular/core';
import { LoginService } from '../../../service/login/login.service';
import { LoginInfo } from '../../../model/login';
import { Router } from '@angular/router';
import { SignalingService } from '../../../service/signaling/signaling.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  public loginError = '';

  constructor(
    private loginService: LoginService
  ) {
    SignalingService.OnInitComplete.subscribe(async () => {
      console.log('entering site with generated user...');
      await this.tryEnterAsync('user' + (Math.floor(Math.random() * 1000)) % 1000);
    });

    SignalingService.OnInitError.subscribe((message) => {
      this.loginError = message;
    });
  }

  async tryEnterAsync(username: string) {
    const failure = await this.loginService.loginAsync(new LoginInfo(username));
    if (!!failure) {
      this.loginError = failure.reason;
    }
  }

}
