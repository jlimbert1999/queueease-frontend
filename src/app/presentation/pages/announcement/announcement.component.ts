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
import { concatMap, debounceTime, filter, finalize, Subject, tap } from 'rxjs';
import {
  AnnouncementService,
  CustomerService,
  SoundService,
} from '../../services';
import { advertisementResponse } from '../../../infrastructure/interfaces';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { SecureUrlPipe } from '../../pipes/secure-url.pipe';
import { ClockComponent } from '../../components';

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
  private queueRequest: Record<string, string> = {};

  branch = this.customerService.branch();
  advertisements = signal<advertisementResponse[]>([]);

  private _notificationEvent$ = new Subject<void>();
  isAnnouncing = signal<boolean>(false);

  constructor() {
    this._listenRequests();
  }

  ngOnInit(): void {
    this._handleNotification();
  }

  private _listenRequests(): void {
    this.announcementService
      .listenRequests()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((request) => !this.queueRequest[request.id]),
        concatMap((request) => {
          this._handleRequest(request);
          return this.soundService
            .speek(request)
            .pipe(finalize(() => delete this.queueRequest[request.id]));
        })
      )
      .subscribe();
  }

  private _handleRequest(advertisement: advertisementResponse) {
    this.queueRequest[advertisement.id] = advertisement.code;
    this._notificationEvent$.next();
    this.advertisements.update((values) => {
      const updated = values.filter(({ id }) => id !== advertisement.id);
      updated.unshift(advertisement);
      if (updated.length > 5) updated.pop();
      return updated;
    });
  }

  private _handleNotification() {
    this._notificationEvent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.isAnnouncing.set(true)),
        debounceTime(20000)
      )
      .subscribe(() => this.isAnnouncing.set(false));
  }
}
