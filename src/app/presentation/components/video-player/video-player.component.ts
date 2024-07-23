import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  input,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements OnInit {
  videoElementRef = viewChild.required<ElementRef<HTMLVideoElement>>('player');

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
    console.log(this.urls()[this.index]);
    this.videoElementRef().nativeElement.autoplay = true;
    const promise = this.videoElementRef().nativeElement.play();
    promise
      .then((_) => {
        // Autoplay started!
      })
      .catch((error) => {});
  }
}
