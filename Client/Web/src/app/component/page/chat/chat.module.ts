import { NgModule } from '@angular/core';
import { ChatPageComponent } from './chat-page.component';
import { ChatRoutingModule } from './chat.routing';
import { MatListModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user/user.service';
import { WebSocketService } from '../../../service/websocket/websocket.service';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule,

    MatListModule,
  ],
  declarations: [
    ChatPageComponent
  ],
  providers: [
    WebSocketService,
    UserService
  ]
})
export class ChatModule {
}
