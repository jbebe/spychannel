import { LoginRoutingModule } from './login.routing';

describe('LoginRoutingModuleModule', () => {
  let loginRoutingModule: LoginRoutingModule;

  beforeEach(() => {
    loginRoutingModule = new LoginRoutingModule();
  });

  it('should create an instance', () => {
    expect(loginRoutingModule).toBeTruthy();
  });
});
