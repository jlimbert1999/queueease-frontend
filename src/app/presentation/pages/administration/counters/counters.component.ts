import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { filter } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { CounterComponent } from './counter/counter.component';
import { CounterService } from '../../../services';
import { PrimengModule } from '../../../../primeng.module';
import { Counter } from '../../../../domain/models';

@Component({
  selector: 'app-service-desks',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './counters.component.html',
  styleUrl: './counters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class CountersComponent implements OnInit {
  private counterService = inject(CounterService);
  private dialogService = inject(DialogService);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  datasource = signal<Counter[]>([]);
  datasize = signal(0);
  term: string = '';

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(CounterComponent, {
      header: 'Crear Ventanilla',
      width: '40rem',
    });
    ref.onClose
      .pipe(filter((result?: any) => !!result))
      .subscribe((category) => {
        this.datasource.update((values) => [category!, ...values]);
        this.datasize.update((value) => (value += 1));
      });
  }

  update(desk: Counter) {
    const ref = this.dialogService.open(CounterComponent, {
      header: 'Edicion Ventanilla',
      width: '40rem',
      data: desk,
    });
    ref.onClose
      .pipe(filter((result?: Counter) => !!result))
      .subscribe((result) => {
        this.datasource.update((values) => {
          const index = values.findIndex((el) => el.id === desk.id);
          values[index] = result!;
          return [...values];
        });
      });
  }

  getData() {
    const supscription =
      this.term !== ''
        ? this.counterService.search(this.term, this.limit(), this.offset())
        : this.counterService.findAll(this.limit(), this.offset());
    supscription.subscribe(({ counters, length }) => {
      this.datasource.set(counters);
      this.datasize.set(length);
    });
  }

  search() {
    this.index.set(0);
    this.getData();
  }
}
