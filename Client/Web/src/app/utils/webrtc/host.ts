import { DataChannelConfig } from './types';
import { EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { WebRTCBase } from './base';
import { AsyncAction } from '../types';
import { DataChannelEventData } from '../../model/chat';

export class WebRTCHost extends WebRTCBase {

  constructor(
    stream?: MediaStream,
    dataChannelConfigs: DataChannelConfig[] = [],
    config?: RTCConfiguration
  ) {
    super(new RTCPeerConnection(config), dataChannelConfigs);
    // init data channel for host
    // that means we only create it, we won't receive the channels one by one
    this.createDataChannels(dataChannelConfigs);
  }

  // public methods

  public async connectAsync(
    sendOfferToRemoteAsync: AsyncAction<RTCSessionDescriptionInit>,
    receiveOfferFromRemote: EventEmitter<RTCSessionDescriptionInit>,
    offerOptions?: RTCOfferOptions
  ) {
    await Promise.all([
      this.setUpConnectionAsync(sendOfferToRemoteAsync, receiveOfferFromRemote, offerOptions),
      this.waitForOpenDataChannelsAsync()
    ]);
  }

  private setUpConnectionAsync(
    sendOfferToRemoteAsync: AsyncAction<RTCSessionDescriptionInit>,
    receiveOfferFromRemote: EventEmitter<RTCSessionDescriptionInit>,
    offerOptions?: RTCOfferOptions
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {

      const rejectTimeout = setTimeout(() => {
        console.info(`Waited ${environment.signalServer.timeoutMs} ms while connnecting. No answer, reject().`);
        reject();
      }, environment.signalServer.timeoutMs);
      receiveOfferFromRemote.subscribe(async (guestSdp) => {
        console.info(`Received guest SDP!`);
        await this.connection.setRemoteDescription(guestSdp);
        console.info(`Clearing timeout for connection.`);
        clearTimeout(rejectTimeout);
        resolve();
      });

      console.info(`Creating own (host) SDP.`);
      const localSdp = await this.connection.createOffer(offerOptions);
      await this.connection.setLocalDescription(localSdp);

      console.info(`Waiting for final local sdp...`);
      this.onLocalSdpCreated.subscribe(async (finalLocalSdp: RTCSessionDescription) => {
        console.info(`Sending own (host) SDP to remote...`);
        await sendOfferToRemoteAsync(finalLocalSdp);
      });
    });
  }

  private createDataChannels(dataChannelConfigs: DataChannelConfig[]) {
    dataChannelConfigs.forEach((config) => {
      const dataChannel = this.connection.createDataChannel(config.name, config.options);
      this.dataChannels[config.name] = dataChannel;
      dataChannel.onerror = (error) => {
        console.log(`Data Channel (${config.name}) Error:`, error);
      };
      dataChannel.onmessage = (event) => {
        console.log(`Data Channel (${config.name}) Message:`, event.data);
        this.dataChannelMultiplexer[config.name].emit(new DataChannelEventData(event.data, config.name));
      };
      dataChannel.onopen = (event: Event) => {
        const state = dataChannel.readyState;
        if (state === 'open') {
          console.warn('data channel opened!');
        }
        console.log(`Data Channel (${config.name}) Open!`);
        config.onOpen.emit(event);
      };
      dataChannel.onclose = () => {
        console.log(`Data Channel (${config.name}) is Closed`);
      };
    });
  }

}
