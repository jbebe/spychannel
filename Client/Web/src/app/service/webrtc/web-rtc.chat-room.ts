import { Action, GetStreamAsync, WebRTCHost } from '../../utils/webrtc/base';
import { EventEmitter } from '@angular/core';
import { SignalingService } from '../signaling/signaling.service';

export class WebRtcChatRoom {

  private userId: string;
  private connection: WebRTCHost;
  private signalingService: SignalingService;

  constructor(userId: string, signalingService: SignalingService) {
    this.userId = userId;
    this.signalingService = signalingService;
  }

  public async initAsync() {
    const mediaStream = await WebRtcChatRoom.GetMediaStreamAsync();
    this.connection = new WebRTCHost(mediaStream);

    const onReceiveOfferFromRemote = new EventEmitter<RTCSessionDescriptionInit>();
    const sendOfferToRemote = async (sdpHeader: RTCSessionDescriptionInit) => {
      const guestSdp = await this.signalingService.ExchangeSdpAsync(this.userId, sdpHeader.sdp);
      onReceiveOfferFromRemote.emit({
        sdp: guestSdp,
        type: 'answer'
      });
    };
    await this.connection.connectAsync(sendOfferToRemote, onReceiveOfferFromRemote);
  }

  public async loadAsync() {

  }

  public async unloadAsync() {
    this.connection.close();
  }

  private static async GetMediaStreamAsync() {
    return await GetStreamAsync({
      camera: { audio: false, video: true }
    });
  }

}
