import {EventEmitter} from "./event/eventEmitter";

export interface IRequestedMedia {
	camera?: MediaStreamConstraints,
	screen?: MediaStreamConstraints
}

export type Action<T> = (_: T) => void;

async function GetStream(request: IRequestedMedia): Promise<MediaStream> {
	if (request.camera) {
		return await navigator.mediaDevices.getUserMedia(request.camera);
	}
	if (request.screen) {
		return await navigator.getDisplayMedia(request.screen);
	}
	throw new Error("Missing requested media type!");
}

export class WebRTCBase {

	private stream?: MediaStream;

	constructor() {

	}

	protected onStreamReady(event: RTCTrackEvent) {
		console.log(event);
	}

}

export class WebRTCGuest extends WebRTCBase {

	private connection: RTCPeerConnection;

	constructor(stream?: MediaStream, config?: RTCConfiguration) {
		super();
		this.connection = new RTCPeerConnection(config);
		this.connection.onicecandidate = (e) =>
			this.onIceCandidate(e);
		this.connection.oniceconnectionstatechange = (e) =>
			this.onIceConnectionStateChange(e);
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

	public async close() {
		this.connection.close();
	}

	// events

	private async onReceiveRemoteOffer(sdp: RTCSessionDescriptionInit) {
		await this.connection.setRemoteDescription(sdp);
	}

	private onIceCandidate(e: RTCPeerConnectionIceEvent) {
		console.log(e);
	}

	private onIceConnectionStateChange(e: Event) {
		console.log(e);
	}

}

export class WebRTCHost extends WebRTCBase {

	private connection: RTCPeerConnection;

	constructor(stream?: MediaStream, config?: RTCConfiguration) {
		super();
		this.connection = new RTCPeerConnection(config);
		this.connection.onicecandidate = (e) =>
			this.onIceCandidate(e);
		this.connection.oniceconnectionstatechange = (e) =>
			this.onIceConnectionStateChange(e);
		if (stream) {
			stream.getTracks()
				.forEach(track => this.connection.addTrack(track, stream));
		}
		this.connection.ontrack = (e) => this.onStreamReady(e);
	}

	// public methods

	public async connect(
		sendOfferToRemote: Action<RTCSessionDescriptionInit>,
		receiveOfferFromRemote: EventEmitter<RTCSessionDescriptionInit>,
		offer?: RTCOfferOptions
	) {
		const description = await this.connection.createOffer(offer);
		await this.connection.setLocalDescription(description);
		sendOfferToRemote(description);
		receiveOfferFromRemote.on((remoteSdp) => this.onReceiveRemoteOffer(remoteSdp));
	}

	public async close() {
		this.connection.close();
	}

	// events

	private async onReceiveRemoteOffer(sdp: RTCSessionDescriptionInit) {
		await this.connection.setRemoteDescription(sdp);
	}

	private onIceCandidate(e: RTCPeerConnectionIceEvent) {
		console.log(e);
	}

	private onIceConnectionStateChange(e: Event) {
		console.log(e);
	}

}
