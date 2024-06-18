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
import { ConfirmationService } from 'primeng/api';

import { GroupwareService, ServiceDeskService } from '../../services';
import { ProfileComponent, StopwatchComponent } from '../../components';
import { RequestStatus } from '../../../domain/enum/request-status.enum';
import { PrimengModule } from '../../../primeng.module';
import { ServiceRequest } from '../../../domain/models';

const actions = {
  [RequestStatus.ABSENT]: 'AUSENTE',
  [RequestStatus.ATTENDED]: 'ATENDIDA',
  [RequestStatus.PENDING]: 'PENDIENTE',
  [RequestStatus.SERVICING]: 'EN SERVICIO',
};

@Component({
  selector: 'app-queue-management',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    ConfirmDialogModule,
    ProfileComponent,
    StopwatchComponent,
  ],
  templateUrl: './queue-management.component.html',
  styleUrl: './queue-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class QueueManagementComponent implements OnInit {
  private groupwareService = inject(GroupwareService);
  private serviceDeksService = inject(ServiceDeskService);
  private confirmationService = inject(ConfirmationService);

  requests = signal<ServiceRequest[]>([]);
  currentRequest = signal<ServiceRequest | null>(null);
  readonly counter = this.serviceDeksService.counter();
  isDialogOpen: boolean = false;

  isNotifying = signal<boolean>(false);
  isEnabledNextButton = computed(
    () => this.requests().length > 0 && this.currentRequest() === null
  );

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
    this.serviceDeksService.getServiceRequests().subscribe(this.requests.set);
  }

  getCurrentRequest(): void {
    this.serviceDeksService
      .getCurrentRequest()
      .subscribe(this.currentRequest.set);
  }

  getNextRequest(): void {
    this.serviceDeksService.nextRequest().subscribe((request) => {
      this.currentRequest.set(request);
      if (request) this._removeRequest(request.id);
    });
  }

  handleRequest(status: RequestStatus) {
    if (!this.currentRequest()) return;
    this.confirmationService.confirm({
      header: 'Confirmar Accion',
      message: `¿Marcar la solicitud como: ${actions[status]}?`,
      accept: () => {
        this.serviceDeksService
          .handleRequest(this.currentRequest()?.id!, status)
          .subscribe(() => {
            this.currentRequest.set(null);
          });
      },
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

  showDialog() {
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

  get requestStatus() {
    return RequestStatus;
  }
}
