import { Injectable, inject, signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { AlertComponent } from '../components';

interface alertConfig {
  header: string;
  description: string;
  width?: number;
  icon?: icons;
  closable?: boolean;
}

type icons = 'error' | 'warning' | 'success' | 'loading' | 'security';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private dialogService = inject(DialogService);

  isLoading = signal(new BehaviorSubject<boolean>(false));
  constructor() {}

  show({ header, width = 30, closable = true, ...props }: alertConfig) {
    return this.dialogService.open(AlertComponent, {
      header: header,
      data: props,
      width: `${width}vw`,
      closable: closable,
      breakpoints: {
        '960px': '90vw',
      },
    });
  }
}
