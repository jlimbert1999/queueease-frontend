import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';

interface data {
  labels: string[];
  datasets: { data: number[] }[];
}

@Component({
  selector: 'multi-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './multi-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiChartComponent {
  labels = input.required<string[]>();
  datasets = input.required<number[]>();

  options = {
    indexAxis: 'y',
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

  data = computed<data>(() => {
    return { labels: this.labels(), datasets: [{ data: this.datasets() }] };
  });
  constructor() {
    // effect(() => {
    //   console.log(this.labels());
    //   this.data.labels = this.labels();
    //   this.data.datasets = [{ data: this.datasets() }];
    // });
  }
}
