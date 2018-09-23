import { ChatRoutingModule } from './chat.routing';

describe('Chat.RoutingModule', () => {
  let chatRoutingModule: ChatRoutingModule;

  beforeEach(() => {
    chatRoutingModule = new ChatRoutingModule();
  });

  it('should create an instance', () => {
    expect(chatRoutingModule).toBeTruthy();
  });
});
