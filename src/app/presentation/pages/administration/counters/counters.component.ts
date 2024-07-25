import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CounterComponent } from './counter/counter.component';
import { CounterService } from '../../../services';
import { PrimengModule } from '../../../../primeng.module';
import {
  PageProps,
  PaginatorComponent,
  ToolbarComponent,
} from '../../../components';
import { counterResponse } from '../../../../infrastructure/interfaces';

@Component({
  selector: 'app-service-desks',
  standalone: true,
  imports: [CommonModule, PrimengModule, PaginatorComponent, ToolbarComponent],
  templateUrl: './counters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountersComponent implements OnInit {
  private counterService = inject(CounterService);
  private dialogService = inject(DialogService);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  datasource = signal<counterResponse[]>([]);
  datasize = signal(0);
  term = signal<string>('');

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(CounterComponent, {
      header: 'Crear Ventanilla',
      width: '40rem',
    });
    ref.onClose.subscribe((result?: counterResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        values.unshift(result);
        if (values.length >= this.limit()) values.pop();
        return [...values];
      });
      this.datasize.update((value) => (value += 1));
    });
  }

  update(desk: counterResponse) {
    const ref = this.dialogService.open(CounterComponent, {
      header: 'Edicion Ventanilla',
      width: '40rem',
      data: desk,
    });
    ref.onClose.subscribe((result?: counterResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el.id === desk.id);
        values[index] = result!;
        return [...values];
      });
    });
  }

  getData() {
    this.counterService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ counters, length }) => {
        this.datasource.set(counters);
        this.datasize.set(length);
      });
  }

  search(value: string) {
    this.index.set(0);
    this.term.set(value);
    this.getData();
  }

  chagePage({ pageIndex, pageSize }: PageProps) {
    this.index.set(pageIndex);
    this.limit.set(pageSize);
    this.getData();
  }
}
