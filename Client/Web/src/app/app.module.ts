import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalService } from './service/global/global.service';
import { WebStorageModule } from 'ngx-store';
import { ApiService } from './service/api/api';
import { SignalRModule, SignalRConfiguration } from 'ng2-signalr';
import { HttpClientModule } from '@angular/common/http';

export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'Ng2SignalRHub';
  c.qs = { user: 'donald' };
  c.url = 'http://ng2-signalr-backend.azurewebsites.net/';
  c.logging = true;

  // >= v5.0.0
  c.executeEventsInZone = true; // optional, default is true
  c.executeErrorsInZone = false; // optional, default is false
  c.executeStatusChangeInZone = true; // optional, default is true
  return c;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouting,
    BrowserAnimationsModule,
    WebStorageModule,
    SignalRModule.forRoot(createConfig)
  ],
  providers: [
    GlobalService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
