import { Injectable } from '@angular/core';
import { ApiService } from '../api/api';

@Injectable()
export class UserService {

  constructor(
    private api: ApiService
  ) { }

  public async getAllUsersAsync(): Promise<string[]> {
    return await this.api.get<string[]>(['user']);
  }
}
