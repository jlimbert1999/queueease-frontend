import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DataViewModule } from 'primeng/dataview';

import { PrimengModule } from '../../../primeng.module';
import {
  GroupwareService,
  AttentionService,
  TimerService,
  AlertService,
} from '../../services';
import { ProfileComponent } from '../../components';
import { ServiceRequest } from '../../../domain/models';
import { ServiceStatus } from '../../../domain/enums/service-status.enum';
import { attentionResponse } from '../../../infrastructure/interfaces';
import { StopwatchComponent } from '../../components/stopwatch/stopwatch.component';

@Component({
  selector: 'app-queue-management',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    DataViewModule,
    ProfileComponent,
    StopwatchComponent,
  ],
  templateUrl: './queue-management.component.html',
  styleUrl: './queue-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueManagementComponent implements OnInit {
  private groupwareService = inject(GroupwareService);
  private attentionService = inject(AttentionService);
  private timerService = inject(TimerService);
  private alertService = inject(AlertService);

  readonly counter = this.attentionService.counter();

  requests = signal<ServiceRequest[]>([]);
  isNotifying = signal<boolean>(false);
  isDialogOpen: boolean = false;
  currentAttention = signal<attentionResponse | null>(null);
  isEnabledNextButton = computed(
    () => this.requests().length > 0 && this.currentAttention() === null
  );
  timer = computed(() => this.timerService.timer());

  constructor() {
    this._connect();
    this._listenNewRequest();
    this._listenHandleRequest();
  }

  ngOnInit(): void {
    this.getCurrentRequest();
    this.getRequests();
  }

  getRequests(): void {
    this.attentionService.getServiceRequests().subscribe((data) => {
      this.requests.set(data);
    });
  }

  getCurrentRequest(): void {
    this.attentionService.getCurrentRequest().subscribe((request) => {
      this.currentAttention.set(request);
      if (request) this.timerService.start();
    });
  }

  getNextRequest(): void {
    this.timerService.reset();
    this.attentionService.nextRequest().subscribe((request) => {
      this.currentAttention.set(request);
      this._removeRequest(request.serviceRequest.id);
      this.timerService.start();
    });
  }

  handleRequest(status: ServiceStatus.ATTENDED | ServiceStatus.ABSENT) {
    if (!this.currentAttention()) return;
    this.alertService
      .question(
        'Confirmar accion',
        `¿Marcar la solicitud como ${
          status === ServiceStatus.ATTENDED ? 'ATENDIDO' : 'AUSENTE'
        }?`
      )
      .subscribe((confirm) => {
        if (!confirm) return;
        this.attentionService
          .handleRequest(this.currentAttention()?.serviceRequest.id!, status)
          .subscribe(() => {
            this.currentAttention.set(null);
            this.timerService.stop();
          });
      });
  }

  notify() {
    if (!this.currentAttention()) return;
    this.isNotifying.set(true);
    const { serviceRequest } = this.currentAttention()!;
    const { number, branch } = this.counter!;
    this.groupwareService.notifyRequest(branch.id, {
      id: serviceRequest.id,
      code: serviceRequest.code,
      counterNumber: number,
    });
    setTimeout(() => this.isNotifying.set(false), 6000);
  }

  info() {
    this.isDialogOpen = true;
  }

  get enum() {
    return ServiceStatus;
  }

  private _connect() {
    if (!this.counter) return;
    this.groupwareService.connect(this.counter);
  }

  private _listenNewRequest(): void {
    this.groupwareService.listenRequest().subscribe((request) => {
      this.requests.update((values) => {
        values.push(request);
        const sorted = values.sort((a, b) => {
          if (b.priority !== a.priority) {
            return b.priority - a.priority;
          }
          return a.createdAt.getTime() - b.createdAt.getTime();
        });
        return [...sorted];
      });
    });
  }

  private _listenHandleRequest() {
    this.groupwareService.onRequestHandled().subscribe((id) => {
      this._removeRequest(id);
    });
  }

  private _removeRequest(id: string) {
    this.requests.update((values) =>
      values.filter((request) => request.id !== id)
    );
  }
}
