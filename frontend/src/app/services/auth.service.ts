import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

import { environment } from '../../environments/environment.production';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

  accessToken$ = this.accessTokenSubject.asObservable();

  router = inject(Router);
  http = inject(HttpClient);

  constructor() {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      this.accessTokenSubject.next(storedToken);
    }
  }

  get accessToken() {
    return this.accessTokenSubject.value;
  }

  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
    this.accessTokenSubject.next(token);
  }

  get isLoggedIn() {
    return !!this.accessToken;
  }

  get isAdmin() {
    let userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData).isAdmin;
    }
    return false;
  }

  get userName() {
    let userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData).name;
    }
    return null;
  }

  get userEmail() {
    let userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData).email;
    }
    return null;
  }

  registerUser(name: string, email: string, password: string) {
    return this.http.post(environment.apiURL + '/auth/register', {
      name,
      email,
      password,
    });
  }

  loginUser(email: string, password: string) {
    return this.http
      .post(
        environment.apiURL + '/auth/login',
        {
          email,
          password,
        },
        { withCredentials: true },
      )
      .pipe(
        tap((result: any) => {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('user', JSON.stringify(result.user));

          this.accessTokenSubject.next(result.accessToken);

          setTimeout(() => {
            this.accessTokenSubject.next(result.accessToken);
          }, 0);
        }),
      );
  }

  refreshToken() {
    return this.http
      .post<{
        accessToken: string;
      }>(
        environment.apiURL + '/auth/refresh-token',
        {},
        { withCredentials: true },
      )
      .pipe(
        tap((result: any) => {
          localStorage.setItem('accessToken', result.accessToken);
          this.accessTokenSubject.next(result.accessToken);
        }),
      );
  }

  logoutUser() {
    this.http
      .post(environment.apiURL + '/auth/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          this.accessTokenSubject.next(null);
          this.router.navigate(['/login']);
        },
      });
  }
}
