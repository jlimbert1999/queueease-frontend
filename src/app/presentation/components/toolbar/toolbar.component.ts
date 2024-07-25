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
  ],
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  title = input.required<string>();
  onSearch = output<string>();
  onCreate = output<void>();

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

  create() {
    this.onCreate.emit();
  }
}
