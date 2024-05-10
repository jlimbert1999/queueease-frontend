import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  readonly branch = signal<number | undefined>(undefined);
  constructor() {}

  setupBranch() {
    const savedBranch = localStorage.getItem('branch');
    // if(typeof savedBranch!=='number') {

    // }
    // this.branch.set(savedBranch?p);
  }

  setBranch(id: number) {
    this.branch.set(id);
    localStorage.setItem('branch', id.toString());
  }
}
