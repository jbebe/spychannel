import { NgModule } from '@angular/core';
import { ChatPageComponent } from './chat-page.component';
import { ChatRoutingModule } from './chat.routing';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user/user.service';
import { WebSocketService } from '../../../service/websocket/websocket.service';
import { ChatSidebarComponent } from '../../shared/chat-sidebar/chat-sidebar.component';
import { ChatMessageBoxComponent } from '../../shared/chat-message-box/chat-message-box.component';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule
  ],
  declarations: [
    ChatPageComponent,
    ChatSidebarComponent,
    ChatMessageBoxComponent
  ],
  providers: [
    WebSocketService,
    UserService
  ]
})
export class ChatModule {
}
