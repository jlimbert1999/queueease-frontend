import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = `${environment.base_url}/users`;
  private http = inject(HttpClient);

  constructor() {}

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ users: any[]; length: number }>(this.url, {
      params,
    });
  }

  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ users: any[]; length: number }>(
      `${this.url}/search/${term}`,
      { params }
    );
  }
}
