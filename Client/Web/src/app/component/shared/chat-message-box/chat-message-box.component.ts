import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../service/interface/message.service';
import { SessionService } from '../../../service/session/session.service';
import { SignalingService } from '../../../service/signaling/signaling.service';

@Component({
  selector: 'shared-chat-message-box',
  templateUrl: './chat-message-box.component.html',
  styleUrls: ['./chat-message-box.component.css']
})
export class ChatMessageBoxComponent implements OnInit {

  public messages: { from: string, text: string }[] = [];

  constructor(
    private sessionService: SessionService,
    private uiMessageService: MessageService
  ) {
    uiMessageService.onSelectUser.subscribe((username) => this.onSelectUser(username));
  }

  ngOnInit() {
  }

  private onSelectUser(username: string) {
    this.messages = [];
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
