import { Component } from '@angular/core';
import { LoginService } from '../../../service/login/login.service';
import { LoginInfo } from '../../../model/login';

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
  }

  async tryEnter(usernameInputRef: HTMLInputElement) {
    const failure = await this.loginService.login(new LoginInfo(usernameInputRef.value));
    if (!!failure) {
      this.loginError = failure.reason;
    }
  }

}
