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
  private servideDeskService = inject(CounterService);
  private dialogService = inject(DialogService);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  length = signal(0);
  desks = signal<Counter[]>([]);

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.servideDeskService
      .findAll(this.limit(), this.offset())
      .subscribe(({ desks, length }) => {
        console.log(desks);
        this.desks.set(desks);
        this.length.set(length);
      });
  }

  create() {
    const ref = this.dialogService.open(CounterComponent, {
      header: 'Crear Ventanilla',
      width: '40rem',
    });
    ref.onClose
      .pipe(filter((result?: any) => !!result))
      .subscribe((category) => {
        this.desks.update((values) => [category!, ...values]);
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
        this.desks.update((values) => {
          const index = values.findIndex((el) => el.id === desk.id);
          values[index] = result!;
          return [...values];
        });
      });
  }
}
