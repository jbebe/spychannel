import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { LoginRoutingModule } from './login.routing';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    LoginRoutingModule,

    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    LoginPageComponent
  ]
})
export class LoginModule {
}
