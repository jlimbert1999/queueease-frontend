import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable } from 'rxjs';

import {
  advertisementResponse,
  counterResponse,
  serviceRequestResponse,
} from '../../../infrastructure/interfaces';
import { ServiceRequest } from '../../../domain/models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupwareService {
  private readonly url = `${environment.base_url}/users`;
  private socket: Socket | null = null;

  constructor() {}

  connect({ services, branch, ...props }: counterResponse): void {
    this.socket = io(this.url, {
      auth: {
        token: localStorage.getItem('token'),
        counter: {
          id: props.id,
          services: services.map(({ id }) => id),
          branchId: branch.id,
        },
      },
    });
  }

  listenRequest() {
    return new Observable<ServiceRequest>((observable) => {
      this.socket?.on('new-request', (data: serviceRequestResponse) => {
        observable.next(ServiceRequest.fromResponse(data));
      });
    });
  }

  onRequestHandled() {
    return new Observable<string>((observable) => {
      this.socket?.on('handle-request', (id: string) => {
        observable.next(id);
      });
    });
  }

  notifyRequest(branchId: string, advertisement: advertisementResponse) {
    this.socket?.emit('notify', { branchId, advertisement });
  }
}
