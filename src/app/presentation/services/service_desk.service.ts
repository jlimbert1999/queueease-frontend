import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { serviceRequestResponse } from '../../infrastructure/interfaces';
import { ServiceRequest } from '../../domain/models';

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

  nextRequest() {
    return this.http.get(`${this.url}/next`);
  }
}
