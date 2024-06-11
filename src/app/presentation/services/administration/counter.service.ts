import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { counterResponse } from '../../../infrastructure/interfaces';
import { CreateServiceDeskDto } from '../../../infrastructure/dtos';
import { Counter } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private readonly url = `${environment.base_url}/counter`;
  private http = inject(HttpClient);

  constructor() {}

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ counters: counterResponse[]; length: number }>(this.url, {
        params,
      })
      .pipe(
        map(({ counters, length }) => ({
          counters: counters.map((el) => Counter.fromResponse(el)),
          length: length,
        }))
      );
  }

  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ counters: counterResponse[]; length: number }>(
        `${this.url}/search/${term}`,
        { params }
      )
      .pipe(
        map(({ counters, length }) => ({
          counters: counters.map((el) => Counter.fromResponse(el)),
          length: length,
        }))
      );
  }

  searchUsersForAssignment(term: string) {
    return this.http.get<any[]>(`${this.url}/assign/${term}`);
  }

  create(form: Object) {
    const deskDto = CreateServiceDeskDto.fromForm(form);
    return this.http
      .post<counterResponse>(`${this.url}`, deskDto)
      .pipe(map((resp) => Counter.fromResponse(resp)));
  }

  update(id: number, form: Partial<CreateServiceDeskDto>) {
    return this.http
      .patch<counterResponse>(`${this.url}/${id}`, form)
      .pipe(map((resp) => Counter.fromResponse(resp)));
  }
}
