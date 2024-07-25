import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';

import { InputGroupModule } from 'primeng/inputgroup';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

export type toolbarActions = {
  icon: string;
  value: string;
  tooltip?: string;
};
@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    AutoFocusModule,
    TooltipModule,
  ],
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  title = input.required<string>();
  actions = input<toolbarActions[]>([]);
  search = input<boolean>(true);

  onSearch = output<string>();
  onAction = output<string>();

  term = new FormControl('');
  isSearching = signal<boolean>(false);

  constructor() {
    this.term.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(370),
        filter((value) => !!value)
      )
      .subscribe((value) => {
        this.onSearch.emit(value!);
      });
  }

  toggleSearch(open: boolean) {
    this.term.reset();
    this.isSearching.set(open);
    if (!open) this.onSearch.emit('');
  }
}
