import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, filter, finalize } from 'rxjs';
import {
  AnnouncementService,
  CustomerService,
  SoundService,
} from '../../services';
import { advertisementResponse } from '../../../infrastructure/interfaces';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { ClockComponent } from '../../components';
import { SecureUrlPipe } from '../../pipes/secure-url.pipe';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent, ClockComponent, SecureUrlPipe],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementComponent implements OnInit {
  private announcementService = inject(AnnouncementService);
  private customerService = inject(CustomerService);
  private soundService = inject(SoundService);
  private destroyRef = inject(DestroyRef);
  private soundList: Record<string, string> = {};

  advertisements = signal<advertisementResponse[]>([]);
  videos = signal<string[]>([]);
  message = signal<string>('');
  alertVideoUrl = signal<string>('');

  constructor() {
    this._listenAnnoucement();
    this.destroyRef.onDestroy(() => {
      this.announcementService.save(this.advertisements());
    });
  }

  ngOnInit(): void {
    this._setupConfig();
  }

  private _listenAnnoucement(): void {
    this.announcementService
      .listenAnncounce()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((request) => !this.soundList[request.id]),
        concatMap((request) => {
          this.soundList[request.id] = request.code;
          this.addAdvertisement(request);
          return this.soundService
            .speek(request)
            .pipe(finalize(() => delete this.soundList[request.id]));
        })
      )
      .subscribe();
  }

  private addAdvertisement(advertisement: advertisementResponse) {
    this.advertisements.update((values) => {
      const updated = values.filter(({ id }) => id !== advertisement.id);
      updated.unshift(advertisement);
      if (updated.length > 5) updated.pop();
      this.announcementService.save(updated);
      return updated;
    });
  }

  private _setupConfig() {
    const { videos, message, alertVideoUrl } = this.customerService.branch();
    this.videos.set(videos);
    this.message.set(message);
    this.alertVideoUrl.set(alertVideoUrl ?? '');
    this.advertisements.set(this.announcementService.load());
  }
}
