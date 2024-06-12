import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable } from 'rxjs';

import { serviceRequestResponse } from '../../../infrastructure/interfaces';
import { environment } from '../../../../environments/environment';
import { ServiceRequest } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class GroupwareService {
  private readonly url = `${environment.base_url}/users`;
  private readonly socket: Socket;

  constructor() {
    this.socket = io(this.url, {
      auth: { token: localStorage.getItem('token') },
    });
  }

  listenRequest() {
    return new Observable<ServiceRequest>((observable) => {
      this.socket?.on('new-request', (data: serviceRequestResponse) => {
        observable.next(ServiceRequest.fromResponse(data));
      });
    });
  }
}
