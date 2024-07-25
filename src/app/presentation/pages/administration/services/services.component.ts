import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import {
  PageProps,
  PaginatorComponent,
  toolbarActions,
  ToolbarComponent,
} from '../../../components';
import { ServiceComponent } from './service/service.component';
import { PrimengModule } from '../../../../primeng.module';
import { ServiceService } from '../../../services';
import { serviceResponse } from '../../../../infrastructure/interfaces';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, PrimengModule, PaginatorComponent, ToolbarComponent],
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit {
  private dialogService = inject(DialogService);
  private serviceService = inject(ServiceService);

  datasource = signal<serviceResponse[]>([]);
  datasize = signal(0);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  readonly actions: toolbarActions[] = [
    { icon: 'pi pi-plus', value: 'create', tooltip: 'Crear' },
  ];

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(ServiceComponent, {
      header: 'Crear Servicio',
      focusOnShow: false,
      width: '50rem',
    });
    ref.onClose.subscribe((result?: serviceResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        values.unshift(result);
        if (values.length >= this.limit()) values.pop();
        return [...values];
      });
      this.datasize.update((value) => (value += 1));
    });
  }

  update(service: serviceResponse) {
    const ref = this.dialogService.open(ServiceComponent, {
      header: 'Editar Servicio',
      data: service,
      width: '50rem',
    });
    ref.onClose.subscribe((result?: serviceResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el.id === result.id);
        values[index] = result!;
        return [...values];
      });
    });
  }

  getData() {
    this.serviceService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ services, length }) => {
        this.datasource.set(services);
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

  handleActions(action: string) {
    switch (action) {
      case 'create':
        this.create();
        break;
      default:
        break;
    }
  }
}
