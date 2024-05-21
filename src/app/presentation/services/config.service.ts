import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _branch = new BehaviorSubject<number | null>(this._getSavedBranch());
  branch$ = this._branch.asObservable();

  constructor() {
    const config = localStorage.getItem('branch');
    if (!config) return;
    if (isNaN(+config)) return;
    this._branch.next(parseInt(config));
  }

  setupBranch(id: number) {
    localStorage.setItem('branch', id.toString());
    this._branch.next(id);
  }

  private _getSavedBranch(): number | null {
    const branch = parseInt(localStorage.getItem('brach') ?? '');
    return isNaN(branch) ? null : branch;
  }
}
