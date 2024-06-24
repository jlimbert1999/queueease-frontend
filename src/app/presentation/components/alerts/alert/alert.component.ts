import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

interface config {
  description: string;
  icon?: string;
}
@Component({
  selector: 'alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  config: config = inject(DynamicDialogConfig).data;
}
