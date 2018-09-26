import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../service/global/global.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  public isVisible = true;

  constructor(
    public globalService: GlobalService
  ) {}

  ngOnInit() {
  }

}
