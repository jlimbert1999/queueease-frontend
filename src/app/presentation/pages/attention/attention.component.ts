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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, Subscription, debounceTime, finalize, switchMap } from 'rxjs';
import { PrimengModule } from '../../../primeng.module';
import { ConfigService, PdfService, CustomerService } from '../../services';
import { menuResponse } from '../../../infrastructure/interfaces';
import { LoaderComponent } from '../../components';
import { numerToWords } from '../../../helpers';
import { TextToSpeekService } from '../../services/text-to-speek.service';
import { MessageService } from 'primeng/api';

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
  private pdfService = inject(PdfService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);

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
    this._setupMenu();
  }

  speak(text: string): void {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    synth.speak(utterance);
  }

  createRequest(priority: number) {
    this.customerService
      .createRequest(
        this.selectedService()!,
        this.configService.branch()?.id!,
        priority
      )
      .subscribe((resp) => {
        console.log(resp);
        this.selectedService.set(null);
        this.stackOptions.update((values) => [values[0]]);
        this._showRequestDone();
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
}
