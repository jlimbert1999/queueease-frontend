import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService, ReportService } from '../../../services';

@Component({
  selector: 'app-report-work',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-work.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportWorkComponent implements OnInit {
  private reportService = inject(ReportService);
  user = inject(AuthService).user;
  datasource = signal<any[]>([]);

  ngOnInit(): void {
    this.reportService.getWorkDetails().subscribe((data) => {
      console.log(data);
      this.datasource.set(data);
    });
  }
}
