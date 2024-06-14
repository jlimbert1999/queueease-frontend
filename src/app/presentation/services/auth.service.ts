import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { JwtPayload } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.base_url}/auth`;
  private http = inject(HttpClient);

  private _user = signal<JwtPayload | null>(null);

  user = computed(() => this._user());
  counterNumber = signal<number | null>(null);

  constructor() {}

  login(login: string, password: string) {
    return this.http
      .post<{ token: string; redirectTo: string }>(this.url, {
        login,
        password,
      })
      .pipe(
        map(({ token, redirectTo }) => {
          this._setAuthentication(token);
          return redirectTo;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._user.set(null);
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
        counterNumber?: number;
      }>(this.url)
      .pipe(
        map(({ token, counterNumber }) =>
          this._setAuthentication(token, counterNumber)
        ),
        catchError(() => {
          return of(false);
        })
      );
  }

  private _setAuthentication(token: string, counterNumber?: number): boolean {
    this._user.set(jwtDecode(token));
    this.counterNumber.set(counterNumber ?? null);
    localStorage.setItem('token', token);
    return true;
  }
}
