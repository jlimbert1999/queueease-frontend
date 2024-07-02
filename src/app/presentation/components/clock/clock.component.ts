import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { timer } from 'rxjs';
import { formatDate } from '../../../helpers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface time {
  hour: string;
  date: string;
}
@Component({
  selector: 'clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  label = signal<time>({ date: '', hour: '' });

  ngOnInit(): void {
    this._initClock();
  }

  private _initClock(): void {
    timer(0, 1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const date = new Date();
        this.label.set({
          hour: formatDate(date.toISOString(), 'HH:mm'),
          date: formatDate(date.toISOString(), 'dddd, D [de] MMMM [de] YYYY'),
        });
      });
  }
}
