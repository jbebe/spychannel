import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { LoginRoutingModule } from './login.routing';

@NgModule({
  imports: [
    LoginRoutingModule
  ],
  declarations: [
    LoginPageComponent
  ]
})
export class LoginModule {
}
