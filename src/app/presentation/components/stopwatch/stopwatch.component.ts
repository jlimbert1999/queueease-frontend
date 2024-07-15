import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FormatDate } from '../../../helpers';

@Component({
  selector: 'stopwatch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stopwatch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchComponent {
  startTime = input.required<string>();
  endTime = input.required<string | null>();

  label = computed<string>(() =>
    FormatDate.duration(new Date(this.startTime()), new Date())
  );
}
