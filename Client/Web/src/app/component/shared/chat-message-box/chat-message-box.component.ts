import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { MessageService } from '../../../service/interface/message.service';
import { SessionService } from '../../../service/session/session.service';
import { ChatMessage, ChatMessageData, UserEntity } from '../../../model/chat';
import { WebRtcService } from '../../../service/webrtc/web-rtc.service';

@Component({
  selector: 'shared-chat-message-box',
  templateUrl: './chat-message-box.component.html',
  styleUrls: ['./chat-message-box.component.css']
})
export class ChatMessageBoxComponent {

  public isActive = false;

  public messages: ChatMessage[];

  constructor(
    private sessionService: SessionService,
    private uiMessageService: MessageService,
    private webRtcService: WebRtcService,
    private zone: NgZone
  ) {
    uiMessageService.onSelectUser.subscribe(
      async (user: UserEntity) => await this.onSelectUserAsync(user));

    this.webRtcService.onChatMessage.subscribe(async (eventData: ChatMessageData) => {
      this.onMessage(eventData);
      this.uiMessageService.onNewMessage.emit(eventData.from);
    });
  }

  private async onSelectUserAsync(user: UserEntity) {
    this.isActive = true;
    console.info(`Loading room for guest: ${user.id}`);
    await this.webRtcService.loadRoomAsync(user.id);
    this.messages = this.webRtcService.messages.slice(0);
  }

  private onMessage(message: ChatMessageData) {
    console.warn('updating ui for new messages...');
    this.zone.run(() => {
      // zone update is needed because the event handler runs in a different... uh. zone? thread? something.
      this.messages = this.webRtcService.messages;
    });
    // extra effect when new message

  }

  sendMessage($event: KeyboardEvent) {
    const textarea = <HTMLTextAreaElement>($event.target);
    const message = textarea.value;
    this.webRtcService.sendMessage(message);
    textarea.value = '';
  }
}
