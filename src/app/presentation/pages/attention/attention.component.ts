import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  Subject,
  catchError,
  debounceTime,
  finalize,
  pipe,
  throwError,
} from 'rxjs';
import { MessageService } from 'primeng/api';

import {
  AlertService,
  ConfigService,
  CustomerService,
  PrintService,
} from '../../services';
import { menuResponse } from '../../../infrastructure/interfaces';
import { PrimengModule } from '../../../primeng.module';
import { LoaderComponent } from '../../components';

@Component({
  selector: 'app-attention',
  standalone: true,
  imports: [CommonModule, PrimengModule, LoaderComponent],
  templateUrl: './attention.component.html',
  styleUrl: './attention.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class AttentionComponent implements OnInit {
  private customerService = inject(CustomerService);
  private configService = inject(ConfigService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private printService = inject(PrintService);
  private alertService = inject(AlertService);

  selectedService = signal<string | null>(null);
  stackOptions = signal<menuResponse[]>([]);
  currentOption = computed(() => {
    const index = this.stackOptions().length;
    if (index === 0) return [];
    return this.stackOptions()[index - 1].services;
  });

  requestServiceSubscription$ = new Subject<number>();
  isLoading = signal(false);

  constructor() {}

  ngOnInit() {
    this._chechPrinter();
    this._setupMenu();
  }

  createRequest(priority: number) {
    this.customerService
      .createRequest(
        this.selectedService()!,
        this.configService.branch()?.id!,
        priority
      )
      .pipe(debounceTime(4000))
      .subscribe((resp) => {
        console.log(resp);
        this.selectedService.set(null);
        this.stackOptions.update((values) => [values[0]]);
        this._showRequestDone();
        this.print();
      });
  }

  selectOption(option: menuResponse) {
    if (option.value) return this.selectedService.set(option.value);
    this.stackOptions.update((values) => [...values, option]);
    this.selectedService.set(null);
  }

  goBack() {
    if (this.selectedService()) return this.selectedService.set(null);
    if (this.stackOptions().length === 1) return;
    this.stackOptions.update((values) => {
      values.pop();
      return [...values];
    });
  }

  get isBackDisabled() {
    return this.stackOptions().length === 1 && !this.selectedService();
  }

  private _setupMenu() {
    const branch = this.configService.branch();
    if (!branch) return;
    this.customerService.getMenu(branch.id).subscribe((resp) => {
      this.stackOptions.set([{ name: 'Inicio', services: resp }]);
    });
  }

  private _chechPrinter() {
    this.printService.check().subscribe({
      error: () => {
        this.alertService.show({
          header: 'Error Impresora',
          description: 'No se ha detectado ninguna impresora',
          icon: 'error',
        });
      },
    });
  }

  private _showRequestDone() {
    this.messageService.clear();
    this.messageService.add({
      key: 'request-done',
      severity: 'success',
      summary: 'Solicitud realizada',
      detail: 'Imprimiendo Ticket',
      life: 1000,
      closable: false,
    });
  }
  
  async print() {
    // this.printService.print().subscribe((resp) => {
    //   console.log(resp);
    // });
  }
}
