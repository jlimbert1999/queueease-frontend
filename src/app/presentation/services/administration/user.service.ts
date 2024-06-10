import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CreateUserDto } from '../../../infrastructure/dtos';
import { userResponse } from '../../../infrastructure/interfaces';

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

  searchForAssign(term: string) {
    return this.http.get<userResponse[]>(`${this.url}/search/assign/${term}`);
  }

  create(form: Object) {
    const user = CreateUserDto.fromForm(form);
    return this.http.post<userResponse>(this.url, user);
  }

  update(id: string, form: Partial<CreateUserDto>) {
    return this.http.patch<userResponse>(`${this.url}/${id}`, form);
  }
}
