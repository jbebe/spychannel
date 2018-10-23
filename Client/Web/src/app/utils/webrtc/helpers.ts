import { IRequestedMedia } from './types';

export async function GetStreamAsync(request: IRequestedMedia): Promise<MediaStream> {
  if (request.camera) {
    return await navigator.mediaDevices.getUserMedia(request.camera);
  }
  if (request.screen) {
    return await navigator.getDisplayMedia(request.screen);
  }
  throw new Error('Missing requested media type!');
}
