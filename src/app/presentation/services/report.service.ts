import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  brachResponse,
  reportServiceUserResponse,
  reportWorkResponse,
} from '../../infrastructure';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly url = `${environment.base_url}/reports`;
  private http = inject(HttpClient);

  searchbranche(term?: string) {
    const params = new HttpParams({ fromObject: { ...(term && { term }) } });
    return this.http.get<brachResponse[]>(`${this.url}/search/branches`, {
      params,
    });
  }

  totalByServiceAndUser(params: {
    branchId: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.http.post<reportServiceUserResponse[]>(
      `${this.url}/service-user`,
      params
    );
  }

  getWorkDetails(date?: Date) {
    return this.http
      .get<reportWorkResponse[]>(`${this.url}/work`)
      .pipe
      // map((resp) =>
      //   resp.map(({ details, ...props }) => ({
      //     ...props,
      //     details: details.map(({ status, total }) => ({ status:'aaa', total })),
      //   }))
      // )
      ();
  }
}
