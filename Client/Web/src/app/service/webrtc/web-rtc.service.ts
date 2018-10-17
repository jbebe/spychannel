import { Injectable } from '@angular/core';
import { SignalingService } from '../signaling/signaling.service';
import { WebRtcChatRoom } from './web-rtc.chat-room';

@Injectable({
  providedIn: 'root'
})
export class WebRtcService {

  private rooms: { [userId: string]: WebRtcChatRoom } = {};
  private currentRoom: string | null = null;

  public constructor(private signalingService: SignalingService) {
  }

  public async loadRoomAsync(userId: any) {

    if (this.currentRoom) {
      await this.rooms[this.currentRoom].unloadAsync();
    }

    if (!(userId in this.rooms)) {
      const room = new WebRtcChatRoom(userId, this.signalingService);
      await room.initAsync();
      this.rooms[userId] = room;
    }
    await this.rooms[userId].loadAsync();
  }

}
