import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  input,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements OnInit {
  videoElementRef =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');

  urls = input.required<string[]>();
  index: number = 0;

  ngOnInit(): void {
    this._loadVideo();
  }

  playNext() {
    this.index++;
    if (this.index === this.urls().length) this.index = 0;
    this._loadVideo();
  }

  private _loadVideo() {
    this.videoElementRef().nativeElement.src = this.urls()[this.index];
    this.videoElementRef().nativeElement.autoplay = true
    const promise = this.videoElementRef().nativeElement.play();
    promise
      .then((_) => {
        // Autoplay started!
        console.log('load');
      })
      .catch((error) => {
        console.log(error);
        // Autoplay was prevented.
        console.log('no play');
      });
  }
}
