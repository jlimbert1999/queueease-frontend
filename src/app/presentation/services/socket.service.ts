import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { serviceRequestResponse } from '../../infrastructure/interfaces';
import { ServiceRequest } from '../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  constructor() {}

  connect() {
    this.socket = io(environment.base_url, {
      auth: { token: localStorage.getItem('token') },
    });
  }

  listenServiceRequests(): Observable<ServiceRequest> {
    return new Observable((observable) => {
      this.socket?.on('new-request', (data: serviceRequestResponse) => {
        observable.next(ServiceRequest.fromResponse(data));
      });
    });
  }

  onQueueEvent(): Observable<ServiceRequest> {
    return new Observable((observable) => {
      this.socket?.on('attention', (data: serviceRequestResponse) => {
        observable.next(ServiceRequest.fromResponse(data));
      });
    });
  }
}
