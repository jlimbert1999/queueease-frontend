import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServiceDeskService {
  private readonly url = `${environment.base_url}/service-desk`;
  private http = inject(HttpClient);
  constructor() {}

  getServiceRequests() {
    return this.http.get<any[]>(this.url);
  }

  nextRequest() {
    return this.http.get(`${this.url}/next`);
  }
}
