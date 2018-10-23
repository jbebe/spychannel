import { EventEmitter, Injectable } from '@angular/core';
import { SignalingService } from '../signaling/signaling.service';
import { WebRtcChatRoom } from './web-rtc.chat-room';
import { ChatMessage, ChatMessageData, DataChannelEventData } from '../../model/chat';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class WebRtcService {

  public static readonly MessageChannelName = 'message';

  private rooms: { [userId: string]: WebRtcChatRoom } = {};
  private currentRoomKey: string | null = null;
  public onChatMessage: EventEmitter<ChatMessageData> = new EventEmitter<ChatMessageData>();
  public messages: ChatMessage[] = [];

  public get currentRoom(): WebRtcChatRoom {
    return this.rooms[this.currentRoomKey];
  }

  public constructor(
    private sessionService: SessionService,
    private signalingService: SignalingService
  ) {

    // register guest room load
    this.signalingService.subscribe.OnRequestSdpExchange = this.onRequestSdpExchange.bind(this);
  }

  public async loadRoomAsync(remoteUserId: string) {

    // if the current room is initialized, unload it to save resource
    if (this.currentRoomKey) {
      console.info(`Unloading previous room with key: ${this.currentRoomKey}`);
      await this.rooms[this.currentRoomKey].unloadAsync();
    }
    this.currentRoomKey = remoteUserId;

    // if no room with given user, create it
    // this will be a long action so we have to show a loading or log window
    if (!(remoteUserId in this.rooms)) {
      console.info(`Creating new room as it does not exist yet: ${this.currentRoomKey}`);
      const room = new WebRtcChatRoom(remoteUserId, this.signalingService);
      room.onRoomMessage.subscribe((messageEventData: DataChannelEventData) => {
        this.onChatMessage.emit(new ChatMessageData(remoteUserId, messageEventData.message, messageEventData.channelName));
      });
      await room.initHostAsync([ WebRtcService.MessageChannelName ]);
      this.rooms[remoteUserId] = room;
    }

    // at the end, load the room
    this.messages = this.rooms[remoteUserId].messages;
  }

  public sendMessage(message: string) {
    if (!this.currentRoomKey) {
      throw Error('Cannot send message if no room is active!');
    }
    const messageData = new ChatMessageData(this.sessionService.currentUser.id, message, WebRtcService.MessageChannelName);
    this.rooms[this.currentRoomKey].sendMessage(messageData);
    this.onChatMessage.emit(messageData);
  }

  private async onRequestSdpExchange(hostId: string, hostSdpHeaderStr: string) {

    if (!(hostId in this.rooms)) {
      const room = new WebRtcChatRoom(hostId, this.signalingService);
      room.onRoomMessage.subscribe((messageEventData: ChatMessageData) => {
        this.onChatMessage.emit(new ChatMessageData(hostId, messageEventData.message, messageEventData.channelName));
      });
      const hostSdpHeader = <RTCSessionDescriptionInit>JSON.parse(hostSdpHeaderStr);
      await room.initGuestAsync(hostSdpHeader, [ WebRtcService.MessageChannelName ]);

      this.rooms[hostId] = room;
    } else {
      throw Error('Sdp request for already created room!');
    }
  }
}
