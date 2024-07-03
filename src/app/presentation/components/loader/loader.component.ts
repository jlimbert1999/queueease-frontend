import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AlertService } from '../../services';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [CommonModule, DialogModule, ProgressSpinnerModule],
  template: ` @if(isLoading | async) {
    <div class="spinner-container">
      <p-progressSpinner ariaLabel="loading" />
    </div>

    }`,
  styles: `.spinner-container {
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.32);
    z-index: 2000;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  private alertService = inject(AlertService);

  get isLoading() {
    return this.alertService.loading$;
  }
}
