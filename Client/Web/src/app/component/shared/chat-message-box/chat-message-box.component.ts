import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MessageService } from '../../../service/interface/message.service';
import { SessionService } from '../../../service/session/session.service';
import { UserEntity } from '../../../model/chat';
import { WebRtcService } from '../../../service/webrtc/web-rtc.service';

@Component({
  selector: 'shared-chat-message-box',
  templateUrl: './chat-message-box.component.html',
  styleUrls: ['./chat-message-box.component.css']
})
export class ChatMessageBoxComponent implements OnInit, AfterViewInit {

  public isActive = true;

  public messages: { from: string, text: string }[] = [];

  constructor(
    private sessionService: SessionService,
    private uiMessageService: MessageService,
    private webRtcService: WebRtcService
  ) {
    uiMessageService.onSelectUser.subscribe(
      async (user: UserEntity) => await this.onSelectUserAsync(user));
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }

  private async onSelectUserAsync(user: UserEntity) {
    this.isActive = true;
    this.messages = [];
    await this.webRtcService.loadRoomAsync(user);

  }

  sendMessage($event: KeyboardEvent) {
    const textarea = (<HTMLTextAreaElement>event.target);
    const message = textarea.value;
    this.messages.push({
      from: this.sessionService.currentUser.username,
      text: message
    });
    textarea.value = '';
  }
}
