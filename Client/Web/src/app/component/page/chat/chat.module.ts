import { NgModule } from '@angular/core';
import { ChatPageComponent } from './chat-page.component';
import { ChatRoutingModule } from './chat.routing';
import { CommonModule } from '@angular/common';
import { ChatSidebarComponent } from '../../shared/chat-sidebar/chat-sidebar.component';
import { ChatMessageBoxComponent } from '../../shared/chat-message-box/chat-message-box.component';
import { UserService } from '../../../service/user/user.service';
import { UserInterfaceService } from '../../../service/interface/user-interface.service';

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
    UserService,
    UserInterfaceService
  ]
})
export class ChatModule {
}
