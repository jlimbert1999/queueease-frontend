import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { timer } from 'rxjs';
import { formatDate } from '../../../helpers';

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
  label = signal<time>({ date: '', hour: '' });

  ngOnInit(): void {
    timer(0, 1000).subscribe(() => {
      const date = new Date();
      this.label.set({
        hour: formatDate(date.toISOString(), 'HH:mm'),
        date: formatDate(date.toISOString(), 'dddd, D [de] MMMM [de] YYYY'),
      });
    });
  }
}
