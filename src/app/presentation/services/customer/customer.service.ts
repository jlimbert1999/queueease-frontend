import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  menuResponse,
  brachResponse,
  branchConfigResponse,
} from '../../../infrastructure/interfaces';
import { catchError, map, Observable, of, throwError } from 'rxjs';

interface savedBranch {
  id: string;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly url = `${environment.base_url}/customers`;
  private http = inject(HttpClient);

  private _branch = signal<branchConfigResponse | null>(null);
  branch = computed<branchConfigResponse>(() => this._branch()!);

  constructor() {}

  searchBranches(term: string) {
    return this.http
      .get<brachResponse[]>(`${this.url}/branches/${term}`)
      .pipe();
  }

  createRequest(id_service: string, id_branch: string, priority: number) {
    return this.http.post<{ code: string; description: string; date: string }>(
      `${this.url}/request`,
      {
        id_service,
        id_branch,
        priority,
      }
    );
  }

  chechBranchConfig(): Observable<boolean> {
    const savedBranch = this.checkSavedBranch();
    if (!savedBranch) return of(false);
    return this.http
      .get<branchConfigResponse>(`${this.url}/branch/${savedBranch.id}`)
      .pipe(
        map((resp) => {
          this._branch.set(resp);
          return true;
        }),
        catchError(() => of(false))
      );
  }

  setBranch(branch: savedBranch | null) {
    console.log(branch);
    if (branch) return localStorage.setItem('branch', JSON.stringify(branch));
    localStorage.removeItem('branch');
    this._branch.set(null);
  }

  checkSavedBranch(): savedBranch | null {
    const savedBranch = localStorage.getItem('branch');
    if (!savedBranch) return null;
    const branch = JSON.parse(savedBranch ?? {});
    const { id, name } = branch;
    if (!id || !name) return null;
    return { id, name };
  }
}
