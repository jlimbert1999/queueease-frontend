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
import { concatMap, filter, finalize, tap } from 'rxjs';
import {
  AnnouncementsSocketService,
  ConfigService,
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
  // private configService = inject(ConfigService);
  private destroyRef = inject(DestroyRef);

  private soundList: Record<number, string> = {};
  requests = signal<ServiceRequest[]>([]);

  constructor() {}

  ngOnInit(): void {
    // this._listenQueueEvent();
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
}
