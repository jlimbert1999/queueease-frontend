import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable } from 'rxjs';

import {
  advertisementResponse,
  serviceRequestResponse,
} from '../../../infrastructure/interfaces';
import { environment } from '../../../../environments/environment';
import { ServiceRequest } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private readonly url = `${environment.base_url}/branches`;
  private socket!: Socket;
  constructor() {
    this.socket = io(this.url, {
      auth: { branch: JSON.parse(localStorage.getItem('branch') ?? '') },
    });
  }

  disconnect() {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  }

  // listenServiceRequests(): Observable<ServiceRequest> {
  //   return new Observable((observable) => {
  //     this.socket?.on('new-request', (data: serviceRequestResponse) => {
  //       observable.next(ServiceRequest.fromResponse(data));
  //     });
  //   });
  // }

  listenAnncounce(): Observable<advertisementResponse> {
    return new Observable((observable) => {
      this.socket?.on('announce', (data: advertisementResponse) => {
        observable.next(data);
      });
    });
  }
}
