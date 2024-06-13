import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, filter, finalize, tap } from 'rxjs';
import {
  AnnouncementService,
  ConfigService,
  CustomerService,
  TextToSpeekService,
} from '../../services';
import { advertisementResponse } from '../../../infrastructure/interfaces';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementComponent implements OnInit {
  private announcementssocketService = inject(AnnouncementService);
  private textToSpeekService = inject(TextToSpeekService);
  private configService = inject(ConfigService);
  private destroyRef = inject(DestroyRef);
  private customerService = inject(CustomerService);

  private soundList: Record<string, string> = {};
  advertisements = signal<advertisementResponse[]>([]);


  videoUrls = signal<string[]>([]);
  message = signal<string>('');
  isLoaging = signal<boolean>(true);

  constructor() {
    this._listenAnnoucement();
  }

  ngOnInit(): void {
    this._getAdvertisement();
    // this._listenQueueEvent();
    // if (!this.configService.branch()) return;
    // this.customerService
    //   .getAdvertisement(this.configService.branch()!)
    //   .subscribe((resp) => {
    //     console.log(resp);
    //   });
  }

  private _listenAnnoucement(): void {
    this.announcementssocketService
      .listenAnncounce()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((request) => {
          this.advertisements.update((values) => [request, ...values]);
        }),
        filter((request) => !this.soundList[request.id]),
        tap((request) => (this.soundList[request.id] = request.code)),
        concatMap((request) =>
          this.textToSpeekService.speek(request).pipe(
            finalize(() => {
              delete this.soundList[request.id];
            })
          )
        )
      )
      .subscribe();
  }

  private _getAdvertisement() {
    this.customerService
      .getAdvertisement(this.configService.branch()!.id)
      .subscribe(({ videos, message }) => {
        this.videoUrls.set(videos);
        this.message.set(message);
        this.isLoaging.set(false);
      });
  }
}
