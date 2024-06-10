import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, debounceTime, filter } from 'rxjs';

export type SelectOption<T> = {
  label: string;
  value: T;
};

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent<T> implements OnInit {
  private destroyRef = inject(DestroyRef);
  private filterSubject = new Subject<string>();

  id = input.required<string>();
  value = input<SelectOption<T>>();
  options = input.required<SelectOption<T>[]>();
  placeholder = input.required<string>();
  required = input<boolean>(false);

  onSearch = output<string>();
  onSelect = output<T>();

  ngOnInit(): void {
    this.filterSubject
      .pipe(
        debounceTime(350),
        takeUntilDestroyed(this.destroyRef),
        filter((value) => !!value)
      )
      .subscribe((value: string) => {
        this.onSearch.emit(value);
      });
  }

  onFilter(value: string) {
    this.filterSubject.next(value);
  }

  onChange(value: T) {
    this.onSelect.emit(value);
  }
}
