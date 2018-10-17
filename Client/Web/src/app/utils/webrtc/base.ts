import { EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface IRequestedMedia {
  camera?: MediaStreamConstraints;
  screen?: MediaStreamConstraints;
}

export type Action<T> = (_: T) => void;
export type AsyncAction<T> = (_: T) => Promise<void>;

export async function GetStreamAsync(request: IRequestedMedia): Promise<MediaStream> {
  if (request.camera) {
    return await navigator.mediaDevices.getUserMedia(request.camera);
  }
  if (request.screen) {
    return await navigator.getDisplayMedia(request.screen);
  }
  throw new Error('Missing requested media type!');
}

export class WebRTCBase {

  constructor(
    protected connection: RTCPeerConnection,
    protected stream?: MediaStream
  ) {
    this.connection.onicecandidate = (e) =>
      this.onIceCandidate(e);
    this.connection.oniceconnectionstatechange = (e) =>
      this.onIceConnectionStateChange(e);
  }

  protected onStreamReady(event: RTCTrackEvent) {
    console.log(event);
  }

  protected onIceCandidate(e: RTCPeerConnectionIceEvent) {
    console.log(e);
  }

  protected onIceConnectionStateChange(e: Event) {
    console.log(e);
  }

  public close() {

    this.connection.close();
  }
}

export class WebRTCGuest extends WebRTCBase {

  constructor(stream?: MediaStream, config?: RTCConfiguration) {
    super(new RTCPeerConnection(config));

    if (stream) {
      stream.getTracks()
        .forEach(track => this.connection.addTrack(track, stream));
    }
    this.connection.ontrack = (e) => this.onStreamReady(e);
  }

  // public methods

  public async receive(
    sendOfferToRemote: Action<RTCSessionDescriptionInit>,
    remoteSDP: RTCSessionDescriptionInit,
    options?: RTCAnswerOptions
  ) {
    await this.connection.setRemoteDescription(remoteSDP);
    const localSDP = await this.connection.createAnswer(options);
    sendOfferToRemote(localSDP);
  }
}

export class WebRTCHost extends WebRTCBase {

  constructor(stream?: MediaStream, config?: RTCConfiguration) {
    super(new RTCPeerConnection(config));
    if (stream) {
      stream.getTracks()
        .forEach(track => this.connection.addTrack(track, stream));
    }
    this.connection.ontrack = (e) => this.onStreamReady(e);
  }

  // public methods

  public async connectAsync(
    sendOfferToRemote: AsyncAction<RTCSessionDescriptionInit>,
    receiveOfferFromRemote: EventEmitter<RTCSessionDescriptionInit>,
    offer?: RTCOfferOptions
  ) {
    return new Promise(async (resolve, reject) => {

      const rejectTimeout = setTimeout(() => reject(), environment.signalServer.timeoutMs);

      const sdpObject = await this.connection.createOffer(offer);
      await this.connection.setLocalDescription(sdpObject);
      await sendOfferToRemote(sdpObject);
      receiveOfferFromRemote.subscribe(async (remoteSdp) => {
        await this.onReceiveRemoteOfferAsync(remoteSdp);
        clearTimeout(rejectTimeout);
        resolve();
      });
    });
  }

  // events

  private async onReceiveRemoteOfferAsync(sdp: RTCSessionDescriptionInit) {
    await this.connection.setRemoteDescription(sdp);
  }

}
