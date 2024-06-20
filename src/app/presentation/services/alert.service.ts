import { Injectable, inject, signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { AlertComponent } from '../components';

interface alertConfig {
  header: string;
  description: string;
  width?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private dialogService = inject(DialogService);

  isLoading = signal(new BehaviorSubject<boolean>(false));
  constructor() {}

  show({ header, description, width = 30 }: alertConfig) {
    this.dialogService.open(AlertComponent, {
      header: header,
      data: description,
      width: `${width}vw`,
      breakpoints: {
        '960px': '90vw',
      },
    });
  }

  showLoading(): void {
    setTimeout(() => {
      this.isLoading().next(true);
    });
  }

  closeLoading(): void {
    this.isLoading().next(false);
  }
}
