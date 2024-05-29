import { Injectable, computed, signal } from '@angular/core';
interface branch {
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _branch = signal<branch | null>(null);
  branch = computed(() => this._branch());

  constructor() {
    this._setupBranch();
  }

  updateBranch(branch: branch) {
    localStorage.setItem('branch', JSON.stringify(branch));
    this._branch.set(branch);
  }

  private _setupBranch() {
    const savedBranch = localStorage.getItem('branch');
    if (!savedBranch) return;
    const branch: branch = JSON.parse(savedBranch);
    if (!branch.id) return;
    this._branch.set(branch);
  }
}
