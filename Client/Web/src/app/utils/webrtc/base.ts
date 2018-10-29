import { DataChannelEventData } from '../../model/chat';
import { DataChannelConfig } from './types';
import { EventEmitter } from '@angular/core';

export class WebRTCBase {

  protected dataChannels: { [name: string]: RTCDataChannel } = {};
  protected dataChannelMultiplexer: { [channelName: string]: EventEmitter<DataChannelEventData> } = {};

  protected onLocalSdpCreated: EventEmitter<RTCSessionDescription> = new EventEmitter<RTCSessionDescription>();

  public get rawConnection(): RTCPeerConnection { return this.connection; }

  constructor(
    protected connection: RTCPeerConnection,
    protected dataChannelConfigs: DataChannelConfig[],
    protected stream?: MediaStream
  ) {
    if (stream) {
      stream.getTracks().forEach(track => this.connection.addTrack(track, stream));
    }
    this.connection.onicecandidate = async (e) => await this.HandleNewIceCandidateAsync(e);
    this.connection.oniceconnectionstatechange = (e) => this.onIceConnectionStateChange(e);
    this.connection.ontrack = (e) => this.onStreamReady(e);
    this.connection.onsignalingstatechange = (data) => console.info(data);

    this.connection.ondatachannel = this.onDataChannel.bind(this);
    this.initDataChannelMultiplexer(dataChannelConfigs);
  }

  protected onStreamReady(event: RTCTrackEvent) {
    console.info(event);
  }

  protected async HandleNewIceCandidateAsync(e: RTCPeerConnectionIceEvent) {
    console.log(e);
    if (e.candidate) {
      if (this.connection.currentRemoteDescription) {
        console.info('Add new ice candidate...');
        await this.connection.addIceCandidate(e.candidate);
      }
    } else {
      console.warn('Candidate search done!');
      this.onLocalSdpCreated.emit(this.connection.localDescription);
    }
  }

  protected onIceConnectionStateChange(e: Event) {
    console.log(e);
  }

  public send(channelName: string, message: string) {
    if (!(channelName in this.dataChannels)) {
      throw Error(`Channel name (${channelName}) not in available data channels!`);
    }
    this.dataChannels[channelName].send(message);
  }

  public close() {
    this.connection.close();
  }

  private initDataChannelMultiplexer(dataChannelConfigs: DataChannelConfig[]) {
    dataChannelConfigs.forEach((config) => {
      this.dataChannelMultiplexer[config.name] = config.onMessage;
    });
  }

  private onDataChannel(dataChannelEvent: RTCDataChannelEvent) {
    console.log(dataChannelEvent);
    const channel = dataChannelEvent.channel;
    const channelName = channel.label;
    if (channelName in this.dataChannels) {
      throw new Error(`Channel name (${channelName}) is already defined in the channels table!`);
    } else {
      this.dataChannels[channelName] = channel;
    }
    channel.onerror = (error) => {
      console.log(`Data Channel (${channelName}) Error:`, error);
    };
    channel.onmessage = (event) => {
      console.log(`Data Channel (${channelName}) Message:`, event.data);
      this.dataChannelMultiplexer[channelName].emit(
        new DataChannelEventData(event.data, channelName));
    };
    channel.onopen = (event) => {
      const state = channel.readyState;
      if (state === 'open') {
        console.warn('data channel opened!');
      }
      console.log(`Data Channel (${channelName}) Open!`);
      const channelConfig = this.dataChannelConfigs.find((config) => config.name === channelName);
      channelConfig.onOpen.emit(event);
    };
    channel.onclose = () => {
      console.log(`Data Channel (${channelName}) is Closed`);
    };
  }

  protected async waitForOpenDataChannelsAsync(): Promise<void> {
    await Promise.all(this.dataChannelConfigs.map(
      (config) => new Promise(((resolve, reject) => {
        config.onOpen.subscribe((event) => {
          resolve();
        });
      }))
    ));
  }
}
