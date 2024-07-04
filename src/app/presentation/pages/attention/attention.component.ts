import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { delay } from 'rxjs';

import {
  AlertService,
  ConfigService,
  CustomerService,
  PrintService,
} from '../../services';
import { PrimengModule } from '../../../primeng.module';
import { LoaderComponent } from '../../components';
import { menuResponse } from '../../../infrastructure/interfaces';

@Component({
  selector: 'app-attention',
  standalone: true,
  imports: [CommonModule, PrimengModule, LoaderComponent],
  templateUrl: './attention.component.html',
  styleUrl: './attention.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionComponent implements OnInit {
  private customerService = inject(CustomerService);
  private configService = inject(ConfigService);
  private printService = inject(PrintService);
  private alertService = inject(AlertService);

  private stackOptions = signal<menuResponse[]>([]);
  selectedService = signal<string | null>(null);
  currentOption = computed(() => {
    const index = this.stackOptions().length;
    if (index === 0) return [];
    return this.stackOptions()[index - 1].services;
  });

  prioritys = [
    { label: 'Atencion General', value: 0 },
    { label: '3ra. Edad / Discapacidad / Embarazadas', value: 1 },
  ] as const;

  ngOnInit() {
    this._setupMenu();
    this._chechPrinter();
  }

  createRequest(priority: number) {
    const dialogRef = this.alertService.show({
      header: 'Generando ticket',
      description: 'Porfavor espere...',
      icon: 'loading',
      closable: false,
    });
    this.customerService
      .createRequest(
        this.selectedService()!,
        this.configService.branch()?.id!,
        priority
      )
      .pipe(delay(800))
      .subscribe((data) => {
        this._printTicket(data.code, data.description, data.date);
        this.goHome();
        dialogRef.close();
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

  goHome() {
    this.selectedService.set(null);
    this.stackOptions.update((values) => [values[0]]);
  }

  private _setupMenu() {
    const branch = this.customerService.branch();
    this.stackOptions.set([{ name: 'Inicio', services: branch.menu }]);
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

  private _printTicket(code: string, description: string, date: string) {
    this.printService.print(code, description, date).subscribe();
  }

  get isBackDisabled() {
    return this.stackOptions().length === 1 && !this.selectedService();
  }
}
