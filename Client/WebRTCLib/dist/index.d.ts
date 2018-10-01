import { EventEmitter } from "./event/eventEmitter";
export interface IRequestedMedia {
    camera?: MediaStreamConstraints;
    screen?: MediaStreamConstraints;
}
export declare type Action<T> = (_: T) => void;
export declare class WebRTCBase {
    private stream?;
    constructor();
    protected onStreamReady(event: RTCTrackEvent): void;
}
export declare class WebRTCGuest extends WebRTCBase {
    private connection;
    constructor(stream?: MediaStream, config?: RTCConfiguration);
    receive(sendOfferToRemote: Action<RTCSessionDescriptionInit>, remoteSDP: RTCSessionDescriptionInit, options?: RTCAnswerOptions): Promise<void>;
    close(): Promise<void>;
    private onReceiveRemoteOffer;
    private onIceCandidate;
    private onIceConnectionStateChange;
}
export declare class WebRTCHost extends WebRTCBase {
    private connection;
    constructor(stream?: MediaStream, config?: RTCConfiguration);
    connect(sendOfferToRemote: Action<RTCSessionDescriptionInit>, receiveOfferFromRemote: EventEmitter<RTCSessionDescriptionInit>, offer?: RTCOfferOptions): Promise<void>;
    close(): Promise<void>;
    private onReceiveRemoteOffer;
    private onIceCandidate;
    private onIceConnectionStateChange;
}
