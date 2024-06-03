import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  brachResponse,
  serviceResponse,
} from '../../../infrastructure/interfaces';
import { CreateBranchDto } from '../../../infrastructure/dtos';
import { Service } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly url = `${environment.base_url}/branches`;
  private http = inject(HttpClient);

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ branches: brachResponse[]; length: number }>(
      this.url,
      { params }
    );
  }

  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ branches: brachResponse[]; length: number }>(
      `${this.url}/search/${term}`,
      { params }
    );
  }

  create(name: string, services: string[]) {
    const branchDto = CreateBranchDto.fromForm(name, services);
    return this.http.post<brachResponse>(`${this.url}`, branchDto);
  }

  update(id: number, name: string, services: string[]) {
    return this.http.patch<brachResponse>(`${this.url}/${id}`, {
      name,
      services,
    });
  }

  searchAvaibles(term: string) {
    return this.http.get<brachResponse[]>(`${this.url}/availables/${term}`);
  }

  getMenu(id: number) {
    return this.http
      .get<serviceResponse[]>(`${this.url}/menu/${id}`)
      .pipe(map((resp) => resp.map((el) => Service.fromResponse(el))));
  }
}
