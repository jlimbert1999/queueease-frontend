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
import { ServiceRequest } from '../../../domain/models';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule],
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
  requests = signal<ServiceRequest[]>([]);
  currentVideoIndex: number = 0;

  videoUrls = signal<string[]>([]);
  message = signal<string>('');

  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;

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
          this.videoPlayer.nativeElement.volume = 0.2;
          this.requests.update((values) => [request, ...values]);
        }),
        filter((request) => !this.soundList[request.id]),
        tap((request) => (this.soundList[request.id] = request.code)),
        concatMap((request) =>
          this.textToSpeekService.speek(request).pipe(
            finalize(() => {
              this.videoPlayer.nativeElement.volume = 0.5;
              delete this.soundList[request.id];
            })
          )
        )
      )
      .subscribe();
  }

  loadVideo() {
    this.videoPlayer.nativeElement.src =
      this.videoUrls()[this.currentVideoIndex];
      this.videoPlayer.nativeElement.volume = 0.5;
    this.videoPlayer.nativeElement.load();
    this.videoPlayer.nativeElement.play();
  }

  onVideoEnded() {
    this.currentVideoIndex =
      (this.currentVideoIndex + 1) % this.videoUrls().length;
    this.loadVideo();
  }

  private _getAdvertisement() {
    this.customerService
      .getAdvertisement(this.configService.branch()!.id)
      .subscribe(({ videos, message }) => {
        this.videoUrls.set(videos);
        this.message.set(message);
        this.loadVideo();
      });
  }
}
