import { Injectable, computed, effect, signal } from '@angular/core';
import { Subscription, interval } from 'rxjs';

import { FormatDate } from '../../helpers';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private value = signal<number>(0);
  private subscription: Subscription | null = null;
  private isStarted = false;

  timer = computed(() => FormatDate.timeToHours(this.value()));

  constructor() {
    this._loadValue();
    effect(() => {
      localStorage.setItem('timer-attention', this.value().toString());
    });
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;
    this.subscription = interval(1000).subscribe(() => {
      this.value.update((value) => (value += 1));
    });
  }

  stop() {
    this.subscription?.unsubscribe();
    this.isStarted = false;
  }

  reset() {
    this.stop();
    this.value.set(0);
    localStorage.removeItem('timer-attention');
  }

  private _loadValue() {
    const data = localStorage.getItem('timer-attention') ?? '';
    const value = parseInt(data);
    if (isNaN(value)) return;
    this.value.set(value);
  }
}
