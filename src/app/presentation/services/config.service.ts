import { Injectable, computed, signal } from '@angular/core';
import { brachResponse } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _branch = signal<brachResponse | null>(null);
  branch = computed(() => this._branch());

  constructor() {
    this._setupBranch();
  }

  updateBranch(branch: brachResponse) {
    localStorage.setItem('branch', JSON.stringify(branch));
    this._branch.set(branch);
  }

  private _setupBranch() {
    const savedBranch = localStorage.getItem('branch');
    if (!savedBranch) return;
    const branch = this._checkSavedBranch(JSON.parse(savedBranch));
    this._branch.set(branch!);
  }

  private _checkSavedBranch(obj: any): brachResponse | null {
    const { id, name } = obj;
    if (!id || !name) return null;
    return obj;
  }
}
