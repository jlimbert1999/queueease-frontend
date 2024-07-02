import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, Subscription, timer } from 'rxjs';

import { ChipModule } from 'primeng/chip';
import { TimerService } from '../../services/timer.service';
interface time {
  hours: number;
  minutes: number;
  seconds: number;
}
@Component({
  selector: 'stopwatch',
  standalone: true,
  imports: [CommonModule, ChipModule],
  templateUrl: './stopwatch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchComponent implements OnInit {
  // eventTimer = input.required<Subject<string>>();

  private running: boolean = false;
  private timerSubscription: Subscription = new Subscription();
  private destroyRef = inject(DestroyRef);

  private timerService = inject(TimerService);

  counterValue = signal<number>(0);
  timer = computed<string>(() => {
    const hours = Math.floor(this.counterValue() / 3600);
    const minutes = Math.floor((this.counterValue() % 3600) / 60);
    const seconds = this.counterValue() % 60;
    return `${this._pad(hours)} : ${this._pad(minutes)} : ${this._pad(
      seconds
    )}`;
  });
  text = computed(() => this.timerService.timer());

  constructor() {}

  ngOnInit(): void {
    this._setupTimer();
    this._listenEventTimer();
    this.timerService.start();
  }

  start() {
    if (this.running) return;
    this.timerSubscription = timer(0, 1000)
      .pipe(takeUntilDestroyed(this.destroyRef)) // Timer, so that the first emit is instantly (interval waits until the period is over for the first emit)
      .subscribe(() => {
        this.counterValue.update((value) => (value += 1));
        localStorage.setItem('timer', this.counterValue().toString());
      });
    this.running = true;
  }

  stop() {
    this.timerSubscription.unsubscribe();
    this.running = false;
  }

  reset() {
    this.stop();
    this.counterValue.set(0);
    localStorage.removeItem('timer');
  }

  private _listenEventTimer() {
    // this.eventTimer().subscribe((value) => {
    //   switch (value) {
    //     case 'start':
    //       this.start();
    //       break;
    //     case 'stop':
    //       this.stop();
    //       break;
    //     default:
    //       break;
    //   }
    // });
  }

  private _setupTimer() {
    const value = localStorage.getItem('timer');
    if (!value || isNaN(parseInt(value))) return;
    this.counterValue.set(parseInt(value));
    this.start();
  }

  _pad(num: number) {
    return num.toString().padStart(2, '0');
  }

}
