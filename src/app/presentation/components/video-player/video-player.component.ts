import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { AnnouncementService } from '../../services';
import { SecureUrlPipe } from '../../pipes/secure-url.pipe';

@Component({
  selector: 'video-player',
  standalone: true,
  imports: [CommonModule, SecureUrlPipe],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements OnInit {
  private annoncementService = inject(AnnouncementService);
  private destroyRef = inject(DestroyRef);

  urls = input.required<string[]>();
  alertVideoUrl = model<string | null>(null);

  index: number = 0;
  videoElementRef = viewChild.required<ElementRef<HTMLVideoElement>>('player');

  constructor() {
    effect(() => {
      if (this.alertVideoUrl()) return;
      this._loadVideo();
    });
  }

  ngOnInit(): void {
    this._listenConnections();
  }

  playNext() {
    this.index++;
    if (this.index === this.urls().length) this.index = 0;
    this._loadVideo();
  }

  private _loadVideo() {
    this.videoElementRef().nativeElement.src = this.urls()[this.index];
    this.videoElementRef().nativeElement.autoplay = true;
    const promise = this.videoElementRef().nativeElement.play();
    promise
      .then((_) => {
        // Autoplay started!
      })
      .catch((error) => {});
  }

  private _listenConnections() {
    this.annoncementService
      .listenAnnounces()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.alertVideoUrl.set(data.url);
      });
  }
}
