import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { LoginRoutingModule } from './login.routing';
import { LoginService } from '../../../service/login/login.service';

@NgModule({
  imports: [
    LoginRoutingModule
  ],
  declarations: [
    LoginPageComponent
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule {
}
