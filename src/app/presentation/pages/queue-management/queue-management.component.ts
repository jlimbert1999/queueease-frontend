import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmationService } from 'primeng/api';

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


@Component({
  selector: 'app-queue-management',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    ConfirmDialogModule,
    ProfileComponent,
    DataViewModule,
  ],
  templateUrl: './queue-management.component.html',
  styleUrl: './queue-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class QueueManagementComponent implements OnInit {
  private groupwareService = inject(GroupwareService);
  private attentionService = inject(AttentionService);
  private timerService = inject(TimerService);
  private alertService = inject(AlertService);

  requests = signal<ServiceRequest[]>([]);
  currentRequest = signal<ServiceRequest | null>(null);

  readonly counter = this.attentionService.counter();
  isDialogOpen: boolean = false;
  isNotifying = signal<boolean>(false);
  isEnabledNextButton = computed(
    () => this.requests().length > 0 && this.currentRequest() === null
  );
  timer = computed(() => this.timerService.timer());

  enum: typeof ServiceStatus = ServiceStatus;

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
      this.currentRequest.set(request);
    });
  }

  getNextRequest(): void {
    this.attentionService.nextRequest().subscribe((request) => {
      this.currentRequest.set(request);
      if (request) this._removeRequest(request.id);
    });
  }

  handleRequest(status: ServiceStatus.ATTENDED | ServiceStatus.ABSENT) {
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
          .handleRequest(this.currentRequest()?.id!, status)
          .subscribe(() => {
            this.currentRequest.set(null);
          });
      });
  }

  notify() {
    if (!this.currentRequest() || !this.counter) return;
    this.isNotifying.set(true);
    const { code, id } = this.currentRequest()!;
    const { number, branch } = this.counter!;
    this.groupwareService.notifyRequest(branch.id, {
      id,
      code,
      counterNumber: number,
    });
    setTimeout(() => this.isNotifying.set(false), 5000);
  }

  info() {
    this.isDialogOpen = true;
  }

  private _connect() {
    if (!this.counter) return;
    this.groupwareService.connect(this.counter);
  }

  private _listenNewRequest() {
    this.groupwareService.listenRequest().subscribe((request) => {
      this._insertRequest(request);
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

  private _insertRequest(request: ServiceRequest) {
    const index = this.requests().findIndex(
      (item) => this._compareRequests(request, item) < 0
    );
    if (index === -1) {
      return this.requests.update((values) => [...values, request]);
    }
    this.requests.update((values) => {
      values.splice(index, 0, request);
      return [...values];
    });
  }

  private _compareRequests(
    newRequest: ServiceRequest,
    currentRequest: ServiceRequest
  ): number {
    if (newRequest.priority !== currentRequest.priority) {
      return currentRequest.priority - newRequest.priority;
    }
    return newRequest.createdAt.getTime() - currentRequest.createdAt.getTime();
  }
}
