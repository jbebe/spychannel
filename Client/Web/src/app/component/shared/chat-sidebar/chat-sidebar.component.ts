import { Component, EventEmitter, Output } from '@angular/core';
import { ChatUserInfo } from '../../../model/chat';
import { SignalingService } from '../../../service/signaling/signaling.service';
import { SessionService } from '../../../service/session/session.service';
import { EventHandlerType } from '../../../utils/signaling';
import { UserService } from '../../../service/user/user.service';
import { MessageService } from '../../../service/interface/message.service';

@Component({
  selector: 'shared-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent {

  public masterUser: ChatUserInfo;
  public activeUsers: ChatUserInfo[] = [];

  private onUserConnected: EventHandlerType;
  private onUserDisconnected: EventHandlerType;

  constructor(
    private sessionService: SessionService,
    private signalingService: SignalingService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.masterUser = sessionService.currentUser;
    this.initUsers();
  }

  private async initUsers() {
    this.activeUsers = (await this.userService.getAllUsersAsync())
      .map(username => new ChatUserInfo(username, true));

    this.onUserConnected = (userName) => {
      const userAlreadyExists = this.activeUsers.some((user) => user.username === userName);
      if (!userAlreadyExists) {
        this.activeUsers = [...this.activeUsers, new ChatUserInfo(userName, true)];
      }
    };

    this.onUserDisconnected = (userName) => {
      const usersWithoutDisconnected = this.activeUsers.filter((userInfo) => userInfo.username !== userName);
      if (this.activeUsers.length !== usersWithoutDisconnected.length) {
        this.activeUsers = usersWithoutDisconnected;
      }
    };

    this.signalingService.subscribe.OnUserConnected = this.onUserConnected;
    this.signalingService.subscribe.OnUserDisconnected = this.onUserDisconnected;
  }

  public selectUser(username: string) {
    this.messageService.onSelectUser.emit(username);
  }

}
