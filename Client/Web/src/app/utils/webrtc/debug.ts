
export function WebRtcDebug(connection: RTCPeerConnection) {
  console.log('>>>>>>> DEBUG >>>>>>>');
  console.log(`Can trickle ice candiates? ${connection.canTrickleIceCandidates ? 'yes' : 'no'}`);
  console.log({ 'connection-state': connection.connectionState });
  console.log({ 'currentLocalDescription': connection.currentLocalDescription });
  console.log({ 'currentRemoteDescription': connection.currentRemoteDescription });
  console.log({ 'iceConnectionState': connection.iceConnectionState });
  console.log({ 'iceGatheringState': connection.iceGatheringState });
  console.log({ 'localDescription': connection.localDescription });
  console.log({ 'remoteDescription': connection.remoteDescription });
  console.log({ 'sctp': connection.sctp });
  console.log({ 'signalingState': connection.signalingState });
  console.log('<<<<<<< DEBUG <<<<<<<');
}
