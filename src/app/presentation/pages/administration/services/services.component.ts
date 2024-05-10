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
import { PrimengModule } from '../../../../primeng.module';
import { ServiceService } from '../../../services';
import { ServiceComponent } from './service/service.component';
import { Service } from '../../../../domain/models';
import { filter } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ServicesComponent implements OnInit {
  private categoryService = inject(ServiceService);
  private dialogService = inject(DialogService);

  services = signal<Service[]>([]);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  length = signal(0);

  ngOnInit(): void {
    this.categoryService
      .findAll(this.limit(), this.offset())
      .subscribe(({ services, length }) => {
        this.services.set(services);
        this.length.set(length);
      });
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
        this.services.update((values) => [service!, ...values]);
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
        this.services.update((values) => {
          const index = values.findIndex((el) => el.id === service.id);
          values[index] = result!;
          return [...values];
        });
      });
  }
}
