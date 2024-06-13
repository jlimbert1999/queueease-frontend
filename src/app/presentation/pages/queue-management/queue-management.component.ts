import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';
import { ProfileComponent } from '../../components';
import { GroupwareService, ServiceDeskService } from '../../services';
import { ServiceRequest } from '../../../domain/models';
import { forkJoin } from 'rxjs';

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

  requests = signal<ServiceRequest[]>([]);
  currentRequest = signal<ServiceRequest | null>(null);

  constructor() {
    this._listenRequest();
  }

  ngOnInit(): void {
    this.getCurrentRequest();
    this.getRequests();
  }

  getRequests() {
    this.serviceDeksService.getServiceRequests().subscribe(this.requests.set);
  }

  getCurrentRequest() {
    this.serviceDeksService
      .getCurrentRequest()
      .subscribe(this.currentRequest.set);
  }

  next() {
    this.serviceDeksService.nextRequest().subscribe((request) => {
      console.log(request);
      this.currentRequest.set(request);
      this._removeRequest(request.id);
    });
  }

  notify() {
    // if (!this.currentRequest()) return;
    // const { code, id } = this.currentRequest()!;
    this.groupwareService.notifyRequest(this.currentRequest()!);
  }

  private _listenRequest() {
    this.groupwareService.listenRequest().subscribe((request) => {
      this._insertRequest(request);
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
