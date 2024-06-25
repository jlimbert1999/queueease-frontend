import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { JwtPayload, menuFrontend } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.base_url}/auth`;
  private http = inject(HttpClient);

  private _user = signal<JwtPayload | null>(null);
  private _menu = signal<menuFrontend[]>([]);
  private _roles = signal<string[]>([]);

  user = computed(() => this._user());
  menu = computed(() => this._menu());
  roles = computed(() => this._roles());

  constructor() {}

  login(login: string, password: string) {
    return this.http
      .post<{ token: string; redirectTo: string }>(this.url, {
        login,
        password,
      })
      .pipe(
        tap(({ token }) => this._setAuthentication(token)),
        map(({ redirectTo }) => redirectTo)
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
        menu: menuFrontend[];
        roles: string[];
      }>(this.url)
      .pipe(
        tap(({ menu, roles }) => {
          this._menu.set(menu);
          this._roles.set(roles);
        }),
        map(({ token }) => this._setAuthentication(token)),
        catchError(() => of(false))
      );
  }

  private _setAuthentication(token: string): boolean {
    this._user.set(jwtDecode(token));
    localStorage.setItem('token', token);
    return true;
  }
}
