import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalService } from './service/global/global.service';
import { WebStorageModule } from 'ngx-store';
import { ApiService } from './service/api/api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRouting,
    BrowserAnimationsModule,
    WebStorageModule
  ],
  providers: [
    GlobalService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
