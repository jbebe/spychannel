import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-stream-window',
  templateUrl: './stream-window.component.html',
  styleUrls: ['./stream-window.component.css']
})
export class StreamWindowComponent implements OnInit {

  @ViewChild('videoElement') ngRefVideo: ElementRef;
  @Input() srcObject: MediaStream;

  private get videoElement(): HTMLVideoElement {
    return this.ngRefVideo.nativeElement as HTMLVideoElement;
  }

  constructor() { }

  ngOnInit() {
    this.videoElement.srcObject = this.srcObject;
    this.videoElement.play();
  }

}
