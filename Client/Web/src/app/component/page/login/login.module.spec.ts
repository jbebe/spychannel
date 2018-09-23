import { LoginModule } from './login.module';

describe('LoginModule', () => {
  let loginModuleModule: LoginModule;

  beforeEach(() => {
    loginModuleModule = new LoginModule();
  });

  it('should create an instance', () => {
    expect(loginModuleModule).toBeTruthy();
  });
});
