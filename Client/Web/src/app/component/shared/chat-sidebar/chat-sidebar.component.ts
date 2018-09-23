import { Component } from '@angular/core';
import { ChatUserInfo } from '../../../entity/chat';
import { UserService } from '../../../service/user/user.service';
import { GlobalService } from '../../../service/global/global.service';

@Component({
  selector: 'shared-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent {

  public masterUser: ChatUserInfo;
  public activeUsers: ChatUserInfo[];

  constructor(
    private userService: UserService,
    private globalService: GlobalService
  ) {
    this.masterUser = new ChatUserInfo(globalService.loginInfo.name, true);
    this.initUsers();
  }

  private async initUsers() {
    this.activeUsers = await this.userService.getActiveUsers();
  }
}