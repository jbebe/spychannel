import { Injectable } from '@angular/core';
import { ApiService } from '../api/api';
import { UserEntity } from '../../model/chat';

@Injectable()
export class UserService {

  constructor(
    private api: ApiService,
  ) { }

  public async getAllUsersAsync(): Promise<UserEntity[]> {
    return await this.api.get<UserEntity[]>(['user']);
  }
}
