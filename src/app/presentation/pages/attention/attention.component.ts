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
  private pdfService = inject(PdfService);
  private destroyRef = inject(DestroyRef);
  private textToSpeekService = inject(TextToSpeekService);

  selectedService = signal<number | null>(null);
  stackOptions = signal<menuResponse[]>([]);
  currentOption = computed(() => {
    const index = this.stackOptions().length;
    if (index === 0) return [];
    return this.stackOptions()[index - 1].services;
  });

  requestServiceSubscription$ = new Subject<number>();
  isLoading = signal(false);

  constructor() {
    // this.playAudioFilesSequentially(this.files);
  }

  play(){
    this.textToSpeekService.speek('ARC73', 2)

  }

  ngOnInit() {
    this._setupMenu();

    // this.requestServiceSubscription$
    //   .pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     switchMap((value) =>
    //       this.customerService.requestService(
    //         this.selectedService()!,
    //         this.configService.branch()!,
    //         value
    //       )
    //     )
    //   )
    //   .subscribe((data) => {
    //     this.stackOptions.update((values) => values.slice(0, 1));
    //     this.selectedService.set(null);
    //   });
    // Obtener lista de voces disponibles
    // this.playAudioSequence(this.files);
  }

  speak(text: string): void {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    synth.speak(utterance);
  }

  createRequest(priority: number) {
    this.requestServiceSubscription$.next(priority);
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
    const id = this.configService.branch();
    if (!id) return;
    this.customerService.getMenu(id!).subscribe((resp) => {
      this.stackOptions.set([{ name: 'Inicio', services: resp }]);
    });
  }

}
