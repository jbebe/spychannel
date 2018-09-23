import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../../service/login/login.service';
import { LoginInfo } from '../../../entity/login';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, AfterViewInit {

  @ViewChild('usernameInput') private usernameInput: ElementRef;

  public loginError = '';

  constructor(
    private loginService: LoginService
  ) {
  }

  ngOnInit(): void {
    (<HTMLInputElement>this.usernameInput.nativeElement).focus();
  }

  ngAfterViewInit(): void {

  }

  async tryEnter(usernameInputRef: HTMLInputElement) {
    const failure = await this.loginService.login(new LoginInfo(usernameInputRef.value));
    if (!!failure) {
      this.loginError = failure.reason;
    }
  }

}
