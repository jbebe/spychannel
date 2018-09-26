
export interface WebSocketEventHandlers {

  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onClosed?: (event: Event) => void;
  onError?: (event: Event) => void;

}
