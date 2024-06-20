import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private readonly url = 'http://localhost:8000';
  private readonly http = inject(HttpClient);

  print() {
    return this.http.post(`${this.url}/api/printer`, {});
  }
}
