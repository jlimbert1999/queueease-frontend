import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { counterResponse } from '../../../infrastructure/interfaces';
import { CreateServiceDeskDto } from '../../../infrastructure/dtos';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private readonly url = `${environment.base_url}/counter`;
  private http = inject(HttpClient);

  constructor() {}

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http.get<{ counters: counterResponse[]; length: number }>(
      this.url,
      {
        params,
      }
    );
  }

  create(form: Object) {
    const deskDto = CreateServiceDeskDto.fromForm(form);
    return this.http.post<counterResponse>(`${this.url}`, deskDto);
  }

  update(id: number, form: Partial<CreateServiceDeskDto>) {
    return this.http.patch<counterResponse>(`${this.url}/${id}`, form);
  }
}
