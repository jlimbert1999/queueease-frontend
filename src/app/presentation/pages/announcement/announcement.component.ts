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
  AnnouncementsSocketService,
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
  private announcementssocketService = inject(AnnouncementsSocketService);
  private textToSpeekService = inject(TextToSpeekService);
  private configService = inject(ConfigService);
  private destroyRef = inject(DestroyRef);
  private customerService = inject(CustomerService);

  private soundList: Record<number, string> = {};
  requests = signal<ServiceRequest[]>([]);
  currentVideoIndex: number = 0;

  videoUrls: string[] = [
    'http://localhost:3000/files/branch/403664d9-5ad9-4aee-ad56-cfec8a4cd7f5.mp4',
    'http://localhost:3000/files/branch/305a4677-f59f-4eec-9ef0-215d3384ee7a.mp4',
    'http://localhost:3000/files/branch/82f8ae1b-8b72-485e-9bb3-687416bc986c.mp4',
    'http://localhost:3000/files/branch/d84a2222-02b6-49ef-be57-c10b1b1c88b5.mp4',
  ];
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    // this._listenQueueEvent();
    if (!this.configService.branch()) return;
    this.customerService
      .getAdvertisement(this.configService.branch()!)
      .subscribe((resp) => {
        console.log(resp);
      });
      this.loadVideo()
  }

  private _listenQueueEvent(): void {
    this.announcementssocketService
      .onQueueEvent()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((request) => {
          console.log(request);
          this.requests.update((values) => [request, ...values]);
        }),
        filter((request) => !this.soundList[request.id]),
        tap((request) => (this.soundList[request.id] = request.code)),
        concatMap((request) =>
          this.textToSpeekService
            .speek(request)
            .pipe(finalize(() => delete this.soundList[request.id]))
        )
      )
      .subscribe();
  }

  loadVideo() {
    this.videoPlayer.nativeElement.src = this.videoUrls[this.currentVideoIndex];
    this.videoPlayer.nativeElement.load();
    this.videoPlayer.nativeElement.play();
  }

  onVideoEnded() {
    this.currentVideoIndex =
      (this.currentVideoIndex + 1) % this.videoUrls.length;
    this.loadVideo();
  }
}
