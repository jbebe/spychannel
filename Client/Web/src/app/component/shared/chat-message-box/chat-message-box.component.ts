import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MessageService } from '../../../service/interface/message.service';
import { SessionService } from '../../../service/session/session.service';
import { UserEntity } from '../../../model/chat';
import { WebRTCHost, EventEmitter } from '@bajuh/webrtc-ts/dist';

@Component({
  selector: 'shared-chat-message-box',
  templateUrl: './chat-message-box.component.html',
  styleUrls: ['./chat-message-box.component.css']
})
export class ChatMessageBoxComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    const host = new WebRTCHost();
    host.connect((sdp) => {
      console.log('send this sdp to remote...');
    }, new EventEmitter<RTCSessionDescriptionInit>())
  }

  public isActive = true;

  public messages: { from: string, text: string }[] = [];

  constructor(
    private sessionService: SessionService,
    private uiMessageService: MessageService
  ) {
    uiMessageService.onSelectUser.subscribe(
      (user: UserEntity) => this.onSelectUser(user));
  }

  ngOnInit() {
  }

  private onSelectUser(user: UserEntity) {
    this.isActive = true;
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
