import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CalendarModule } from 'primeng/calendar';

import { AuthService, PdfService, ReportService } from '../../../services';
import { reportWorkResponse } from '../../../../infrastructure';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-work',
  standalone: true,
  imports: [CommonModule, CalendarModule, FormsModule],
  templateUrl: './report-work.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportWorkComponent implements OnInit {
  private reportService = inject(ReportService);
  private pdfService = inject(PdfService);
  user = inject(AuthService).user;
  datasource = signal<reportWorkResponse[]>([]);

  reportDate = new Date();

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.reportService.getWorkDetails(this.reportDate).subscribe((data) => {
      console.log(data);
      this.datasource.set(data);
    });
  }
  generate() {
    this.pdfService.generateReportWork(
      'ds',
      this.datasource(),
      this.reportDate
    );
  }
}
