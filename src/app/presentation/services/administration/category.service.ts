import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { categoryResponse } from '../../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly url = `${environment.base_url}/categories`;
  private http = inject(HttpClient);
  constructor() {}

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http.get<{ categories: categoryResponse[]; length: number }>(
      this.url,
      { params }
    );
  }

  create(name: string) {
    return this.http.post<categoryResponse>(`${this.url}`, { name });
  }

  update(id: number, name: string) {
    return this.http.put<categoryResponse>(`${this.url}/${id}`, { name });
  }
}
