import { WebRTCBase } from './base';
import { AsyncAction } from '../types';
import { DataChannelConfig } from './types';
import { EventEmitter } from '@angular/core';

export class WebRTCGuest extends WebRTCBase {

  constructor(
    stream?: MediaStream,
    dataChannelConfigs: DataChannelConfig[] = [],
    config?: RTCConfiguration) {
    super(new RTCPeerConnection(config), dataChannelConfigs);
  }

  // public methods

  public async connectAsync(
    sendOfferToRemoteAsync: AsyncAction<RTCSessionDescriptionInit>,
    remoteSDP: RTCSessionDescriptionInit,
    answerOptions?: RTCAnswerOptions
  ) {
    await Promise.all([
      this.setUpConnectionAsync(sendOfferToRemoteAsync, remoteSDP, answerOptions),
      this.waitForOpenDataChannelsAsync()
    ]);
  }

  private async setUpConnectionAsync(
    sendOfferToRemoteAsync: AsyncAction<RTCSessionDescriptionInit>,
    remoteSDP: RTCSessionDescriptionInit,
    answerOptions?: RTCAnswerOptions
  ): Promise<void> {
    await this.connection.setRemoteDescription(remoteSDP);
    console.info(`Creating own (guest) SDP.`);
    const localSDP = await this.connection.createAnswer(answerOptions);
    await this.connection.setLocalDescription(localSDP);

    console.info(`Waiting for final local sdp...`);
    this.onLocalSdpCreated.subscribe(async (finalLocalSdp: RTCSessionDescription) => {
      console.info(`Sending own (guest) SDP to remote...`);
      await sendOfferToRemoteAsync(finalLocalSdp);
    });
  }
}
