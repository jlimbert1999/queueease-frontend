import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttentionSocketService {
  private readonly url = `${environment.base_url}/users`;
  private readonly socket: Socket;

  constructor() {
    this.socket = io(this.url, {
      auth: { token: localStorage.getItem('token') },
    });
  }
}
