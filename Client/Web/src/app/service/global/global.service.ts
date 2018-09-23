import { Injectable } from '@angular/core';
import { LoginInfo } from '../../entity/login';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public loginInfo: LoginInfo;

  constructor() { }
}
