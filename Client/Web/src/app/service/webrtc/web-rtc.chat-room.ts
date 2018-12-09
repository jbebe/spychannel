import { EventEmitter } from '@angular/core';
import { SignalingService } from '../signaling/signaling.service';
import { ChatMessage, ChatMessageData, DataChannelEventData } from '../../model/chat';
import { WebRTCHost } from '../../utils/webrtc/host';
import { WebRTCGuest } from '../../utils/webrtc/guest';
import { DataChannelConfig } from '../../utils/webrtc/types';
import { GetStreamAsync } from '../../utils/webrtc/helpers';
import { WebRtcConstant } from '../../utils/webrtc/constants';

export class WebRtcChatRoom {

  private remoteUserId: string;
  private connection: WebRTCHost | WebRTCGuest | null = null;
  private signalingService: SignalingService;
  public messages: ChatMessage[] = [];
  public onRoomMessage: EventEmitter<DataChannelEventData> = new EventEmitter<DataChannelEventData>();

  constructor(remoteUserId: string, signalingService: SignalingService) {
    this.remoteUserId = remoteUserId;
    this.signalingService = signalingService;

    this.onRoomMessage.subscribe((message: DataChannelEventData) => {
      this.messages.push(new ChatMessage(remoteUserId, message.message));
    });
  }

  public async initHostAsync(dataChannelNames: string[]) {
    console.info(`Creating new room as host`);

    // create connection
    // const mediaStream = await WebRtcChatRoom.GetMediaStreamAsync();
    const dataChannels = dataChannelNames.map((name) => {
      return new DataChannelConfig(name, this.onRoomMessage);
    });
    this.connection = new WebRTCHost(undefined/*mediaStream*/, dataChannels);

    // send offer to guest
    const sendOfferToRemoteAsync = async (sdpHeader: RTCSessionDescriptionInit) => {
      console.info(
        `Calling RequestSdpExchangeAsync with ${this.remoteUserId}, ${JSON.stringify(sdpHeader).substr(0, 10)}...`);
      await this.signalingService.RequestSdpExchangeAsync(this.remoteUserId, sdpHeader);
    };

    // receive offer from guest
    const onReceiveOfferFromRemote = new EventEmitter<RTCSessionDescriptionInit>();
    const onRespondToSdpExchange = ((guestId: string, guestSdpHeader: RTCSessionDescriptionInit) => {
      guestSdpHeader = <RTCSessionDescriptionInit>JSON.parse(<string>guestSdpHeader);
      console.info(
        `Event received from OnRespondToSdpExchange with ${guestId}, ${JSON.stringify(guestSdpHeader).substr(0, 10)}...`);
      if (this.remoteUserId === guestId) {
        console.info(`Remote response matches waited guest id: ${guestId}`);
        onReceiveOfferFromRemote.emit(guestSdpHeader);
        this.signalingService.unsubscribe.OnRespondToSdpExchange = onRespondToSdpExchange;
      } else {
        console.info(`Remote response does not match waited guest id: ${this.remoteUserId} != ${guestId}`);
      }
    });
    this.signalingService.subscribe.OnRespondToSdpExchange = onRespondToSdpExchange;

    // try to connect to guest
    console.info(`Connect to remote client...`);
    await (<WebRTCHost>this.connection).connectAsync(sendOfferToRemoteAsync, onReceiveOfferFromRemote);
    this.sendMessage(new ChatMessageData('host', 'connected!', WebRtcConstant.MessageChannelName));
  }

  public async initGuestAsync(hostSdpHeader: RTCSessionDescriptionInit, dataChannelNames: string[]) {
    console.info(`Creating new room as guest`);

    // create connection
    // const mediaStream = await WebRtcChatRoom.GetMediaStreamAsync();
    const dataChannels = dataChannelNames.map((name) => {
      return new DataChannelConfig(name, this.onRoomMessage);
    });
    this.connection = new WebRTCGuest(undefined/*mediaStream*/, dataChannels);

    // send offer to host
    const sendOfferToRemote = async (sdpHeader: RTCSessionDescriptionInit) => {
      console.info(
        `Calling RequestSdpExchangeAsync with ${this.remoteUserId}, ${JSON.stringify(sdpHeader).substr(0, 10)}...`);
      await this.signalingService.RespondToSdpExchangeAsync(this.remoteUserId, sdpHeader);
    };

    // try to connect to host
    console.info(`Connect to remote client...`);
    await (<WebRTCGuest>this.connection).connectAsync(sendOfferToRemote, hostSdpHeader);
    this.sendMessage(new ChatMessageData('guest', 'connected!', WebRtcConstant.MessageChannelName));
  }

  public async loadAsync() {

  }

  public async unloadAsync() {
    //this.connection.close();
  }

  public sendMessage(chatMessageData: ChatMessageData) {
    this.messages.push(new ChatMessage(chatMessageData.from, chatMessageData.message));
    this.connection.send(chatMessageData.channelName, chatMessageData.message);
  }

  public static async GetMediaStreamAsync(): Promise<MediaStream> {
    return await GetStreamAsync({
      camera: {
        video: {
          width: 320,
          height: 240,
        }
      }
    });
  }
}
