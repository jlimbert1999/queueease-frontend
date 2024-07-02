import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface config {
  description: string;
  icon?: string;
  confirmation?: boolean;
}

@Component({
  selector: 'alert',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private dialogRef = inject(DynamicDialogRef);

  config: config = inject(DynamicDialogConfig).data;

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
