import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { concatMap, filter, finalize, tap } from 'rxjs';
import { SocketService, TextToSpeekService } from '../../services';
import { ServiceRequest } from '../../../domain/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvertisementComponent implements OnInit {
  list = signal<ServiceRequest[]>([]);
  private socketService = inject(SocketService);
  private textToSpeekService = inject(TextToSpeekService);
  private soundList: Record<number, string> = {};
  private destroyRef = inject(DestroyRef);

  constructor() {}

  ngOnInit(): void {
    this._listenQueueEvent();
  }

  private _listenQueueEvent(): void {
    this.socketService
      .onQueueEvent()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((request) => {
          console.log('listen');
          this.list.update((values) => [request, ...values]);
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
