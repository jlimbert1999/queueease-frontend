import { Injectable, computed, signal } from '@angular/core';
import { brachResponse } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _branch = signal<string | null>(null);
  branch = computed(() => this._branch());

  constructor() {
    this._setupBranch();
  }

  updateBranch(id: string) {
    localStorage.setItem('branch', id);
    this._branch.set(id);
  }

  private _setupBranch() {
    const savedBranch = localStorage.getItem('branch');
    if (!savedBranch) return;
    this._branch.set(savedBranch);
  }
}
