import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { brachResponse, reportServiceUserResponse } from '../../infrastructure';

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
    return this.http.get<any[]>(`${this.url}/work`);
  }
}
