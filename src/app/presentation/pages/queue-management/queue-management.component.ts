import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AuthService,
  GroupwareService,
  ServiceDeskService,
} from '../../services';
import { PrimengModule } from '../../../primeng.module';
import { ServiceRequest } from '../../../domain/models';
import { ProfileComponent } from '../../components';
import { RequestStatus } from '../../../domain/enum/request-status.enum';

@Component({
  selector: 'app-queue-management',
  standalone: true,
  imports: [CommonModule, PrimengModule, ProfileComponent],
  templateUrl: './queue-management.component.html',
  styleUrl: './queue-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueManagementComponent implements OnInit {
  private groupwareService = inject(GroupwareService);
  private serviceDeksService = inject(ServiceDeskService);
  private authService = inject(AuthService);

  requests = signal<ServiceRequest[]>([]);
  currentRequest = signal<ServiceRequest | null>(null);

  enableNextButton = computed(
    () => this.requests().length > 0 && this.currentRequest() === null
  );

  constructor() {
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
      this._removeRequest(request.id);
    });
  }

  updateRequest(status: RequestStatus) {
    if (!this.currentRequest()) return;
    this.serviceDeksService
      .updateRequest(this.currentRequest()?.id!, status)
      .subscribe(() => {
        this.currentRequest.set(null);
      });
  }

  notify() {
    if (!this.currentRequest()) return;
    this.groupwareService.notifyRequest(this.currentRequest()!);
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

  get status() {
    return RequestStatus;
  }

  get counterNumber() {
    return this.authService.counterNumber();
  }
}
