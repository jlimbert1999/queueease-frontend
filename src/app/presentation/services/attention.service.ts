import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ServiceRequest, ServiceStatus } from '../../domain';
import {
  attentionResponse,
  counterResponse,
  serviceRequestResponse,
} from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AttentionService {
  private readonly url = `${environment.base_url}/attention`;
  private http = inject(HttpClient);

  private _counter = signal<counterResponse | null>(null);
  counter = computed(() => this._counter()!);

  getServiceRequests() {
    return this.http
      .get<serviceRequestResponse[]>(this.url)
      .pipe(map((resp) => resp.map((el) => ServiceRequest.fromResponse(el))));
  }

  getCurrentRequest() {
    return this.http.get<attentionResponse | null>(`${this.url}/current`);
  }

  nextRequest() {
    return this.http.get<attentionResponse>(`${this.url}/next`);
  }

  handleRequest(id: string, status: ServiceStatus) {
    return this.http.patch<{ message: string }>(`${this.url}/handle/${id}`, {
      status,
    });
  }

  checkCounter(): Observable<boolean> {
    return this.http.get<counterResponse>(`${this.url}/check`).pipe(
      map((resp) => {
        this._counter.set(resp);
        return true;
      }),
      catchError(() => of(false))
    );
  }
}
