import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserAuth } from '../models/auth/user-auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    try {

      let userAuth: UserAuth = localStorage.getItem('userAuth') ? localStorage.getItem('userAuth') as any : '{}';
      userAuth = JSON.parse(userAuth as any);
      const token = userAuth.token;
      return next.handle(request.clone({ setHeaders: { authorization: token || '' } }));
    } catch (exc) {
      console.error(exc);
      throw exc;
    }
  }
}
