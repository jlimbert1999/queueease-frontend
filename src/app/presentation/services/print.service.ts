import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private readonly url = environment.printer_url;
  private readonly http = inject(HttpClient);

  print(code: string, description: string, date: string) {
    return this.http.post<{ message: string }>(this.url, {
      code,
      description,
      date,
    });
  }

  check() {
    return this.http.get<{ message: string }>(`${this.url}/check`);
  }
}
