import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  categoryResponse,
  serviceResponse,
} from '../../../infrastructure/interfaces';
import { ServiceDto } from '../../../infrastructure/dtos';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly url = `${environment.base_url}/services`;
  private http = inject(HttpClient);
  constructor() {}

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http.get<{ services: serviceResponse[]; length: number }>(
      this.url,
      { params }
    );
  }

  create(form: Object) {
    const serviceDto = ServiceDto.fromForm(form);
    return this.http.post<serviceResponse>(`${this.url}`, serviceDto);
  }

  update(id: string, form: Object) {
    return this.http.patch<serviceResponse>(`${this.url}/${id}`, form);
  }

  getCategories() {
    return this.http.get<categoryResponse[]>(`${this.url}/categories`);
  }

  searchAvailables(term: string) {
    return this.http.get<serviceResponse[]>(`${this.url}/availbles/${term}`);
  }
}
