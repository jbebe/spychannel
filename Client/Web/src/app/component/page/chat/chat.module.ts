import { NgModule } from '@angular/core';
import { ChatPageComponent } from './chat-page.component';
import { ChatRoutingModule } from './chat.routing';

@NgModule({
  imports: [
    ChatRoutingModule
  ],
  declarations: [
    ChatPageComponent
  ]
})
export class ChatModule {
}
