
export class UserEntity {

  public get id(): string {
    return this.username;
  }

  constructor(
    public username: string,
    public creationDate: string
  ) {}

}
