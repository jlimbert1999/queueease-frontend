import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable } from 'rxjs';

import { advertisementResponse } from '../../../infrastructure/interfaces';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private readonly url = `${environment.base_url}/branches`;
  private socket: Socket;

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

  listenRequests(): Observable<advertisementResponse> {
    return new Observable((observable) => {
      this.socket.on('announce', (data: advertisementResponse) => {
        observable.next(data);
      });
    });
  }

  listenAnnounces(): Observable<{ url: string | null }> {
    return new Observable((observable) => {
      this.socket.on('announce-video', (data: { url: string }) => {
        observable.next(data);
      });
    });
  }

  save(data: advertisementResponse[]): void {
    sessionStorage.setItem('announcement', JSON.stringify(data));
  }

  load(): advertisementResponse[] {
    const data = sessionStorage.getItem('announcement');
    if (!data) return [];
    return JSON.parse(data);
  }
}
