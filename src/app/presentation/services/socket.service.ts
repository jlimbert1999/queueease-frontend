import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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

  listenServiceRequests(): Observable<any[]> {
    return new Observable((observable) => {
      this.socket?.on('new-request', (data: any[]) => {
        observable.next(data);
      });
    });
  }

  listenQueueEvent() {
    return new Observable((observable) => {
      this.socket?.on('attention', (data: any) => {
        console.log(data);
        observable.next(data);
      });
    });
  }
}
