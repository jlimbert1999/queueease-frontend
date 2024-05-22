import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [CommonModule, DialogModule, ProgressSpinnerModule],
  template: `
    <p-dialog
      [visible]="isOpenend()"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '35rem' }"
    >
      <ng-template pTemplate="headless">
        <div class="flex overflow-hidden bg-white px-4">
          <div
            class="flex-grow-1 flex-shrink-1 flex align-items-center justify-content-center font-bold p-2 text-2xl"
          >
            {{ text() }}
          </div>
          <div
            class="flex-shrink-0 flex align-items-center justify-content-center font-bold p-2 border-round ml-5"
          >
            <p-progressSpinner
              ariaLabel="loading"
              strokeWidth="6"
              styleClass="w-8rem h-8rem"
            />
          </div>
        </div>
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  text = input.required<string>();
  isOpenend = input.required<boolean>();
}
