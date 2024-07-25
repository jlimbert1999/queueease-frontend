import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { preferenceResponse } from '../../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PreferenceService {
  private readonly url = `${environment.base_url}/preferences`;
  private http = inject(HttpClient);

  constructor() {}

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http.get<{ preferences: preferenceResponse[]; length: number }>(
      this.url,
      {
        params,
      }
    );
  }

  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ preferences: preferenceResponse[]; length: number }>(
      `${this.url}/search/${term}`,
      { params }
    );
  }

  create(form: Object) {
    return this.http.post<preferenceResponse>(`${this.url}`, form);
  }

  update(id: number, form: Object) {
    return this.http.patch<preferenceResponse>(`${this.url}/${id}`, form);
  }
}
