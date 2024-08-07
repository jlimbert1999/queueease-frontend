import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  brachResponse,
  serviceResponse,
} from '../../../infrastructure/interfaces';
import { CreateBranchDto } from '../../../infrastructure/dtos';

interface updateBranchProps {
  id: string;
  form: Partial<CreateBranchDto>;
  services: string[];
}
@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly url = `${environment.base_url}/branches`;
  private http = inject(HttpClient);

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http.get<{ branches: brachResponse[]; length: number }>(
      this.url,
      { params }
    );
  }

  create(form: Object, services: string[]) {
    const branchDto = CreateBranchDto.fromForm(form, services);
    return this.http.post<brachResponse>(`${this.url}`, branchDto);
  }

  update({ id, services, form }: updateBranchProps) {
    const branchDto = { ...form, services };
    return this.http.patch<brachResponse>(`${this.url}/${id}`, branchDto);
  }

  searchAvaibles(term?: string) {
    const params = new HttpParams({
      fromObject: { ...(term ? { term } : {}) },
    });
    return this.http.get<brachResponse[]>(`${this.url}/availables`, { params });
  }

  getBranchServices(id: string) {
    return this.http.get<serviceResponse[]>(`${this.url}/services/${id}`);
  }

  getMenu(id: number) {
    return this.http.get<serviceResponse[]>(`${this.url}/menu/${id}`);
  }

  uploadVideos(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post<{ files: string[] }>(
      `${environment.base_url}/files/branch`,
      formData
    );
  }

  announceVideo(url: string | null, branches: string[]) {
    return this.http.post<{ message: string }>(`${this.url}/announce`, {
      url,
      branches,
    });
  }
}
