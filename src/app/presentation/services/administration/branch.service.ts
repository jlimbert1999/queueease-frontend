import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  brachResponse,
  serviceResponse,
} from '../../../infrastructure/interfaces';
import { CreateBranchDto } from '../../../infrastructure/dtos';
import { Branch, Service, serviceProps } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly url = `${environment.base_url}/branches`;
  private http = inject(HttpClient);

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<[brachResponse[], number]>(this.url, { params }).pipe(
      map((resp) => ({
        branches: resp[0].map((el) => Branch.fromResponse(el)),
        length: resp[1],
      }))
    );
  }

  create(name: string, services: serviceProps[]) {
    const branchDto = CreateBranchDto.fromForm(name, services);
    return this.http
      .post<brachResponse>(`${this.url}`, branchDto)
      .pipe(map((resp) => Branch.fromResponse(resp)));
  }

  update(id: number, name: string, services: serviceProps[]) {
    return this.http
      .patch<brachResponse>(`${this.url}/${id}`, {
        name,
        services: services.map((el) => el.id),
      })
      .pipe(map((resp) => Branch.fromResponse(resp)));
  }

  searchAvaibles(term: string) {
    return this.http
      .get<brachResponse[]>(`${this.url}/availables/${term}`)
      .pipe(map((resp) => resp.map((el) => Branch.fromResponse(el))));
  }

  getServicesByBranch(id: number) {
    return this.http
      .get<serviceResponse[]>(`${this.url}/services/${id}`)
      .pipe(map((resp) => resp.map(({ id, name }) => ({ id, name }))));
  }

  getMenu(id: number) {
    return this.http
      .get<serviceResponse[]>(`${this.url}/menu/${id}`)
      .pipe(map((resp) => resp.map((el) => Service.fromResponse(el))));
  }
}
