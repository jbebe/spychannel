import { AppRouting } from './app.routing';

describe('AppRoutingModule', () => {
  let appRoutingModule: AppRouting;

  beforeEach(() => {
    appRoutingModule = new AppRouting();
  });

  it('should create an instance', () => {
    expect(appRoutingModule).toBeTruthy();
  });
});
