import { Component } from '@angular/core';
import { UserEntity } from '../../../model/chat';
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

  public masterUser: UserEntity;
  public activeUsers: UserEntity[] = [];

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
      .filter((user) => user.username !== this.masterUser.username);

    this.onUserConnected = (newUser: UserEntity) => {
      const userAlreadyExists =
        this.activeUsers.some((user) => user.username === newUser.username);
      if (!userAlreadyExists) {
        this.activeUsers = [...this.activeUsers, newUser];
      }
    };

    this.onUserDisconnected = (disconnectedUser: UserEntity) => {
      const usersWithoutDisconnected =
        this.activeUsers.filter((userInfo) => userInfo.username !== disconnectedUser.username);
      if (this.activeUsers.length !== usersWithoutDisconnected.length) {
        this.activeUsers = usersWithoutDisconnected;
      }
    };

    this.signalingService.subscribe.OnUserConnected = this.onUserConnected;
    this.signalingService.subscribe.OnUserDisconnected = this.onUserDisconnected;
  }

  public selectUser(user: UserEntity) {
    this.messageService.onSelectUser.emit(user);
  }

}
