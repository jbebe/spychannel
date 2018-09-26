import { Injectable } from '@angular/core';
import { LoginInfo } from '../../model/login';
import { LocalStorage } from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public message: string;

  constructor() { }
}
