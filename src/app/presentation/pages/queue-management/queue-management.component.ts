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

  private _listenRequest() {
    this.groupwareService.listenRequest().subscribe((request) => {
      this.requests.update((values) => {
        values.unshift(request);
        return [...values];
      });
    });
  }

  private _removeRequest(id: string) {
    this.requests.update((values) =>
      values.filter((request) => request.id !== id)
    );
  }
}
