"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function GetStream(request) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.camera) {
            return yield navigator.mediaDevices.getUserMedia(request.camera);
        }
        if (request.screen) {
            return yield navigator.getDisplayMedia(request.screen);
        }
        throw new Error("Missing requested media type!");
    });
}
class WebRTCBase {
    constructor() {
    }
    onStreamReady(event) {
        console.log(event);
    }
}
exports.WebRTCBase = WebRTCBase;
class WebRTCGuest extends WebRTCBase {
    constructor(stream, config) {
        super();
        this.connection = new RTCPeerConnection(config);
        this.connection.onicecandidate = (e) => this.onIceCandidate(e);
        this.connection.oniceconnectionstatechange = (e) => this.onIceConnectionStateChange(e);
        if (stream) {
            stream.getTracks()
                .forEach(track => this.connection.addTrack(track, stream));
        }
        this.connection.ontrack = (e) => this.onStreamReady(e);
    }
    receive(sendOfferToRemote, remoteSDP, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.setRemoteDescription(remoteSDP);
            const localSDP = yield this.connection.createAnswer(options);
            sendOfferToRemote(localSDP);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection.close();
        });
    }
    onReceiveRemoteOffer(sdp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.setRemoteDescription(sdp);
        });
    }
    onIceCandidate(e) {
        console.log(e);
    }
    onIceConnectionStateChange(e) {
        console.log(e);
    }
}
exports.WebRTCGuest = WebRTCGuest;
class WebRTCHost extends WebRTCBase {
    constructor(stream, config) {
        super();
        this.connection = new RTCPeerConnection(config);
        this.connection.onicecandidate = (e) => this.onIceCandidate(e);
        this.connection.oniceconnectionstatechange = (e) => this.onIceConnectionStateChange(e);
        if (stream) {
            stream.getTracks()
                .forEach(track => this.connection.addTrack(track, stream));
        }
        this.connection.ontrack = (e) => this.onStreamReady(e);
    }
    connect(sendOfferToRemote, receiveOfferFromRemote, offer) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = yield this.connection.createOffer(offer);
            yield this.connection.setLocalDescription(description);
            sendOfferToRemote(description);
            receiveOfferFromRemote.on((remoteSdp) => this.onReceiveRemoteOffer(remoteSdp));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection.close();
        });
    }
    onReceiveRemoteOffer(sdp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.setRemoteDescription(sdp);
        });
    }
    onIceCandidate(e) {
        console.log(e);
    }
    onIceConnectionStateChange(e) {
        console.log(e);
    }
}
exports.WebRTCHost = WebRTCHost;
//# sourceMappingURL=index.js.map