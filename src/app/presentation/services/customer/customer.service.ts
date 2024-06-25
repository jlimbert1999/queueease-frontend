import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  brachResponse,
  menuResponse,
} from '../../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly url = `${environment.base_url}/customers`;
  private http = inject(HttpClient);
  constructor() {}

  getMenu(id_branch: string) {
    return this.http
      .get<menuResponse[]>(`${this.url}/menu/${id_branch}`)
      .pipe();
  }

  searchBranches(term: string) {
    return this.http
      .get<brachResponse[]>(`${this.url}/branches/${term}`)
      .pipe();
  }

  getAdvertisement(id_branch: string) {
    return this.http.get<{ message: string; videos: string[] }>(
      `${this.url}/advertisement/${id_branch}`
    );
  }

  createRequest(id_service: string, id_branch: string, priority: number) {
    return this.http.post<{ code: string; description: string; date: string }>(
      `${this.url}/request`,
      {
        id_service,
        id_branch,
        priority,
      }
    );
  }
}
