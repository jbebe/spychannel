import { Component } from '@angular/core';
import { ChatUserInfo } from '../../../model/chat';
import { SignalingService } from '../../../service/signaling/signaling.service';
import { SessionService } from '../../../service/session/session.service';

@Component({
  selector: 'shared-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent {

  public masterUser: ChatUserInfo;
  public activeUsers: ChatUserInfo[] = [];

  constructor(
    private sessionService: SessionService,
    private signalingService: SignalingService
  ) {
    this.masterUser = sessionService.currentUser;
    this.initUsers();
  }

  private async initUsers() {
    this.activeUsers = (await this.signalingService.GetAllUserAsync())
      .map(username => new ChatUserInfo(username, true));
    this.signalingService.subscribe.OnUserConnected = (userName) => {
      const userAlreadyIn = this.activeUsers.some((user) => user.username === userName);
      if (!userAlreadyIn) {
        this.activeUsers = [...this.activeUsers, new ChatUserInfo(userName, true)];
      }
    };
  }
}
