import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalService } from './service/global/global.service';
import { WebStorageModule } from 'ngx-store';
import { ApiService } from './service/api/api';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from './service/session/session.service';
import { MessageComponent } from './component/page/message/message.component';
import { SignalingService } from './service/signaling/signaling.service';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouting,
    BrowserAnimationsModule,
    WebStorageModule
  ],
  providers: [
    GlobalService,
    ApiService,
    SignalingService,
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
