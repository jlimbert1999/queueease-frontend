import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  set branch(id: number | null) {
    if (!id) return;
    localStorage.setItem('branch', id.toString());
  }

  get branch(): number | null {
    const branch = localStorage.getItem('branch');
    return branch ? parseInt(branch) : null;
  }
}
