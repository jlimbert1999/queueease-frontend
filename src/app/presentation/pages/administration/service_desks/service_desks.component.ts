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
import { ServiceDeskComponent } from './service_desk/service_desk.component';
import { ServiceCounterService } from '../../../services';
import { PrimengModule } from '../../../../primeng.module';
import { ServiceDesk } from '../../../../domain/models';

@Component({
  selector: 'app-service-desks',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './service_desks.component.html',
  styleUrl: './service_desks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ServiceDesksComponent implements OnInit {
  private servideDeskService = inject(ServiceCounterService);
  private dialogService = inject(DialogService);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  length = signal(0);
  desks = signal<ServiceDesk[]>([]);

  ngOnInit(): void {
    this.getData();
    
  }

  getData() {
    this.servideDeskService
      .findAll(this.limit(), this.offset())
      .subscribe(({ desks, length }) => {
        this.desks.set(desks);
        this.length.set(length);
      });
  }

  create() {
    const ref = this.dialogService.open(ServiceDeskComponent, {
      header: 'Crear Ventanilla',
      width: '40rem',
    });
    ref.onClose
      .pipe(filter((result?: any) => !!result))
      .subscribe((category) => {
        this.desks.update((values) => [category!, ...values]);
      });
  }

  update(desk: ServiceDesk) {
    const ref = this.dialogService.open(ServiceDeskComponent, {
      header: 'Edicion Ventanilla',
      width: '40rem',
      data: desk,
    });
    ref.onClose
      .pipe(filter((result?: ServiceDesk) => !!result))
      .subscribe((result) => {
        this.desks.update((values) => {
          const index = values.findIndex((el) => el.id === desk.id);
          values[index] = result!;
          return [...values];
        });
      });
  }
}
