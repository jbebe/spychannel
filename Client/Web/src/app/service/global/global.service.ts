import { Injectable } from '@angular/core';
import { LoginInfo } from '../../entity/login';
import { LocalStorage } from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  @LocalStorage() public loginInfo: LoginInfo;

  constructor() { }
}
