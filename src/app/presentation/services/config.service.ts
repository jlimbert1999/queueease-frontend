import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _branch = signal<number | null>(null);
  branch = computed(() => this._branch());

  constructor() {
    const config = localStorage.getItem('branch');
    if (!config) return;
    if (isNaN(+config)) return;
    this._branch.set(parseInt(config));
  }

  setupBranch(id: number) {
    localStorage.setItem('branch', id.toString());
    this._branch.set(id);
  }
}
