import { Component, NgZone } from '@angular/core';
import { UserEntity } from '../../../model/chat';
import { SignalingService } from '../../../service/signaling/signaling.service';
import { SessionService } from '../../../service/session/session.service';
import { EventHandlerType } from '../../../utils/signaling';
import { UserService } from '../../../service/user/user.service';
import { UserInterfaceService } from '../../../service/interface/user-interface.service';

class SidebarUserEntity {

  constructor(
    public entity: UserEntity,
    public newMessageCount: number
  ) {
  }
}

@Component({
  selector: 'shared-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent {

  public get masterUser(): UserEntity {
    return this.sessionService.currentUser;
  }

  public activeUsers: SidebarUserEntity[] = [];
  public selectedUser: SidebarUserEntity | null;

  constructor(
    private sessionService: SessionService,
    private signalingService: SignalingService,
    private userService: UserService,
    private messageService: UserInterfaceService,
    private zone: NgZone
  ) {
    this.initUsers();
    this.messageService.onNewMessage.subscribe((userId: string) => {
      if (this.masterUser.id === userId || (this.selectedUser && this.selectedUser.entity.id === userId)) {
        return;
      }
      this.zone.run(() => {
        const sidebarUser = this.activeUsers.find((sidebarUserEntity) => sidebarUserEntity.entity.id === userId);
        sidebarUser.newMessageCount += 1;
      });
    });
  }

  private async initUsers() {
    this.activeUsers = await this.getActiveUsersAsync();

    this.signalingService.subscribe.OnUserConnected = this.addNewUser.bind(this);
    this.signalingService.subscribe.OnUserDisconnected = this.removeUser.bind(this);
  }

  public selectUser(user: SidebarUserEntity) {
    this.selectedUser = user;
    user.newMessageCount = 0;
    this.messageService.onSelectUser.emit(user.entity);
  }

  public async addNewUser(newUser: UserEntity) {
    const userAlreadyExists =
      this.activeUsers.some((userEntity) => userEntity.entity.username === newUser.username);
    if (!userAlreadyExists) {
      const userEntity = new SidebarUserEntity(UserEntity.Cast(newUser), 0);
      this.activeUsers = [...this.activeUsers, userEntity];
    }
  }

  public async removeUser(disconnectedUser: UserEntity) {
    const usersWithoutDisconnected =
      this.activeUsers.filter((userEntity: SidebarUserEntity) => userEntity.entity.username !== disconnectedUser.username);
    if (this.activeUsers.length !== usersWithoutDisconnected.length) {
      this.activeUsers = usersWithoutDisconnected;
    }
  }

  public async getActiveUsersAsync() {
    return (await this.userService.getAllUsersAsync())
      .filter((user) => user.username !== this.masterUser.username)
      .map(UserEntity.Cast)
      .map((userEntity) => {
        return {
          entity: userEntity,
          newMessageCount: 0
        };
      });
  }

}
