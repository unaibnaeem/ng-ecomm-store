import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AuthService } from '../services/auth.service';

const isRefreshing = new BehaviorSubject<boolean>(false);
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    }),
  );
};

const handle401Error = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
) => {
  if (!isRefreshing.getValue()) {
    isRefreshing.next(true);
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((tokenResponse: any) => {
        isRefreshing.next(false);
        const newAccessToken = tokenResponse.accessToken;

        authService.setAccessToken(newAccessToken);
        refreshTokenSubject.next(newAccessToken);

        const newReq = req.clone({
          setHeaders: { Authorization: `Bearer ${newAccessToken}` },
        });
        return next(newReq);
      }),
      catchError((err) => {
        isRefreshing.next(false);
        authService.logoutUser();
        return throwError(() => err);
      }),
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const newReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(newReq);
      }),
    );
  }
};
