import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { menuResponse } from '../../../infrastructure/interfaces';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly url = `${environment.base_url}/customers`;
  private http = inject(HttpClient);
  constructor() {}

  getMenu(id_branch: number) {
    return this.http
      .get<menuResponse[]>(`${this.url}/menu/${id_branch}`)
      .pipe();
  }

  requestService(id_service: number, id_branch: number, priority: number) {
    return this.http.post(`${this.url}/request`, {
      id_service,
      id_branch,
      priority,
    });
  }
}
