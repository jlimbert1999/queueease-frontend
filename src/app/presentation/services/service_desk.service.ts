import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { serviceRequestResponse } from '../../infrastructure/interfaces';
import { ServiceRequest } from '../../domain/models';
import { RequestStatus } from '../../domain/enum/request-status.enum';

@Injectable({
  providedIn: 'root',
})
export class ServiceDeskService {
  private readonly url = `${environment.base_url}/service-desk`;
  private http = inject(HttpClient);
  constructor() {}

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
    return this.http.get<serviceRequestResponse>(`${this.url}/next`).pipe(
      tap((resp) => console.log(resp)),
      map((resp) => ServiceRequest.fromResponse(resp))
    );
  }

  updateRequest(id: string, status: RequestStatus) {
    return this.http.patch<{ message: string }>(`${this.url}/${id}`, {
      status,
    });
  }
}
