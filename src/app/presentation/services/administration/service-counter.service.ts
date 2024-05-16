import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { serviceDeskResponse } from '../../../infrastructure/interfaces';
import { CreateServiceDeskDto } from '../../../infrastructure/dtos';
import { ServiceDesk, serviceProps } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class ServiceCounterService {
  private readonly url = `${environment.base_url}/service-desks`;
  private http = inject(HttpClient);

  constructor() {}

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<[serviceDeskResponse[], number]>(this.url, { params })
      .pipe(
        map((resp) => ({
          desks: resp[0].map((el) => ServiceDesk.fromResponse(el)),
          length: resp[1],
        }))
      );
  }

  create(form: Object, services: serviceProps[]) {
    const deskDto = CreateServiceDeskDto.fromForm(form, services);
    return this.http
      .post<serviceDeskResponse>(`${this.url}`, deskDto)
      .pipe(map((resp) => ServiceDesk.fromResponse(resp)));
  }

  update(id: number, form: Partial<CreateServiceDeskDto>) {
    return this.http
      .patch<serviceDeskResponse>(`${this.url}/${id}`, form)
      .pipe(map((resp) => ServiceDesk.fromResponse(resp)));
  }
}
