import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

import {
  brachResponse,
  reportServiceUserResponse,
} from '../../../../infrastructure';

import { ReportService } from '../../../services';
import { MultiChartComponent } from '../../../components';

@Component({
  selector: 'app-report-service-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    MultiChartComponent,
  ],
  templateUrl: './report-service-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportServiceUserComponent implements OnInit {
  private reportService = inject(ReportService);
  private formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    branchId: ['', Validators.required],
    startDate: [null],
    endDate: [new Date()],
  });

  branches = signal<brachResponse[]>([]);
  labels = signal<string[]>([]);
  datasets = signal<number[]>([]);

  chartData = signal<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });

  datasource = signal<reportServiceUserResponse[]>([]);
  maxDate: Date = new Date();

  ngOnInit(): void {
    this._getBranches();
  }

  generate() {
    this.reportService
      .totalByServiceAndUser(this.form.value)
      .subscribe((data) => {
        this.datasource.set(data);
        this.chartData.set({
          labels: data.map(({ service }) => service),
          values: data.map(({ total }) => total),
        });
      });
  }

  reset() {
    this.form.reset();
    this.datasource.set([]);
    this.chartData.set({ labels: [], values: [] });
  }

  private _getBranches() {
    this.reportService.searchbranche().subscribe((resp) => {
      this.branches.set(resp);
    });
  }
}
