import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { filter } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { PageProps, PaginatorComponent } from '../../../components';
import { ServiceComponent } from './service/service.component';
import { PrimengModule } from '../../../../primeng.module';
import { Service } from '../../../../domain/models';
import { ServiceService } from '../../../services';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, PrimengModule, PaginatorComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit {
  private dialogService = inject(DialogService);
  private serviceService = inject(ServiceService);

  datasource = signal<Service[]>([]);
  datasize = signal(0);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = '';

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(ServiceComponent, {
      header: 'Crear Servicio',
      focusOnShow: false,
      width: '50rem',
    });
    ref.onClose
      .pipe(filter((result?: Service) => !!result))
      .subscribe((service) => {
        this.datasource.update((values) => [service!, ...values]);
        this.datasize.update((value) => (value += 1));
      });
  }

  update(service: Service) {
    const ref = this.dialogService.open(ServiceComponent, {
      header: 'Editar Servicio',
      data: service,
      width: '50rem',
    });
    ref.onClose
      .pipe(filter((result?: Service) => !!result))
      .subscribe((result) => {
        this.datasource.update((values) => {
          const index = values.findIndex((el) => el.id === service.id);
          values[index] = result!;
          return [...values];
        });
      });
  }

  getData() {
    const supscription =
      this.term !== ''
        ? this.serviceService.search(this.term, this.limit(), this.offset())
        : this.serviceService.findAll(this.limit(), this.offset());
    supscription.subscribe(({ services, length }) => {
      this.datasource.set(services);
      this.datasize.set(length);
    });
  }

  chagePage({ pageIndex, pageSize }: PageProps) {
    this.index.set(pageIndex);
    this.limit.set(pageSize);
    this.getData();
  }
}
