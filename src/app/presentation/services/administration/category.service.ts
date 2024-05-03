import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { categoryResponse } from '../../../infrastructure/interfaces';
import { Category } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly url = `${environment.base_url}/categories`;
  private http = inject(HttpClient);
  constructor() {}

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<[categoryResponse[], number]>(this.url, { params })
      .pipe(
        map(([categories, length]) => ({
          categories: categories.map((el) => Category.fromResponse(el)),
          length,
        }))
      );
  }

  create(name: string) {
    return this.http
      .post<categoryResponse>(`${this.url}`, { name })
      .pipe(map((resp) => Category.fromResponse(resp)));
  }

  update(id: number, name: string) {
    return this.http
      .put<categoryResponse>(`${this.url}/${id}`, { name })
      .pipe(map((resp) => Category.fromResponse(resp)));
  }
}
