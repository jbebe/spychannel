import { Component, OnInit } from '@angular/core';
import { ChatUserInfo } from '../../../entity/chat';
import { UserService } from '../../../service/user/user.service';
import { GlobalService } from '../../../service/global/global.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  public masterUser: ChatUserInfo;
  public activeUsers: ChatUserInfo[];

  constructor(
    private userService: UserService,
    private globalService: GlobalService
  ) {
    this.masterUser = new ChatUserInfo(globalService.loginInfo.name, true);
    this.activeUsers = userService.getActiveUsers();
  }

  ngOnInit() {
  }

}
