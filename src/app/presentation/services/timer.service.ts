import { DestroyRef, Injectable, effect, inject, signal } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { FormatDate } from '../../helpers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private value = signal<number>(0);
  private subscription: Subscription | null = null;
  private destroyRef = inject(DestroyRef);
  private isStarted = false;

  timer = signal<string>('00:00:00');

  constructor() {
    effect(() => {
      localStorage.setItem('timer-attention', this.value().toString());
    });
    this._loadValue();
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;
    this.subscription = interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.value.update((value) => (value += 1));
        this.timer.set(FormatDate.timeToHours(this.value()));
      });
  }

  stop() {
    this.subscription?.unsubscribe();
    this.isStarted = false;
  }

  reset() {
    this.stop();
    this.value.set(0);
  }

  private _loadValue() {
    const data = localStorage.getItem('timer-attention') ?? '';
    const value = parseInt(data);
    if (isNaN(value)) return;
    this.value.set(value);
    this.timer.set(FormatDate.timeToHours(this.value()));
  }
}
