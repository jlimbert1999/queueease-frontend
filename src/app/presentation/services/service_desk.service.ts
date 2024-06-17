import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  counterDetail,
  counterResponse,
  serviceRequestResponse,
} from '../../infrastructure/interfaces';
import { ServiceRequest } from '../../domain/models';
import { RequestStatus } from '../../domain/enum/request-status.enum';

@Injectable({
  providedIn: 'root',
})
export class ServiceDeskService {
  private readonly url = `${environment.base_url}/service-desk`;
  private http = inject(HttpClient);
  counter = signal<counterResponse | null>(null);

  getServiceRequests() {
    return this.http
      .get<serviceRequestResponse[]>(this.url)
      .pipe(map((resp) => resp.map((el) => ServiceRequest.fromResponse(el))));
  }

  getCurrentRequest() {
    return this.http
      .get<serviceRequestResponse | null>(`${this.url}/current`)
      .pipe(map((resp) => (resp ? ServiceRequest.fromResponse(resp) : null)));
  }

  nextRequest() {
    return this.http
      .get<serviceRequestResponse | null>(`${this.url}/next`)
      .pipe(map((resp) => (resp ? ServiceRequest.fromResponse(resp) : null)));
  }

  updateRequest(id: string, status: RequestStatus) {
    return this.http.patch<{ message: string }>(`${this.url}/${id}`, {
      status,
    });
  }

  getCounterDetails() {
    return this.http.get<counterResponse>(`${this.url}/detail`).pipe(
      map((resp) => {
        this.counter.set(resp);
        return true;
      }),
      catchError(() => of(false))
    );
  }
}
