import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  categoryResponse,
  serviceResponse,
} from '../../../infrastructure/interfaces';
import { Category, Service } from '../../../domain/models';
import { ServiceDto } from '../../../infrastructure/dtos';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly url = `${environment.base_url}/services`;
  private http = inject(HttpClient);
  constructor() {}

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ services: serviceResponse[]; length: number }>(this.url, {
        params,
      })
      .pipe(
        map(({ services, length }) => ({
          services: services.map((el) => Service.fromResponse(el)),
          length,
        }))
      );
  }

  create(form: Object) {
    const serviceDto = ServiceDto.fromForm(form);
    return this.http
      .post<serviceResponse>(`${this.url}`, serviceDto)
      .pipe(map((resp) => Service.fromResponse(resp)));
  }

  update(id: number, form: Object) {
    return this.http
      .patch<serviceResponse>(`${this.url}/${id}`, form)
      .pipe(map((resp) => Service.fromResponse(resp)));
  }

  getCategories() {
    return this.http
      .get<categoryResponse[]>(`${this.url}/categories`)
      .pipe(map((resp) => resp.map((el) => Category.fromResponse(el))));
  }

  searchAvailables(term: string) {
    return this.http
      .get<serviceResponse[]>(`${this.url}/availbles/${term}`)
      .pipe(map((resp) => resp.map((el) => Service.fromResponse(el))));
  }
}
