import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuth } from '../models/auth/user-auth';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _config = {
    authUrl: '/authsrv'
  };
  constructor(
    private _http: HttpClient
  ) { }

  signup(username: string, email: string): Observable<void> {
    return this._http.post<void>(`${this._config.authUrl}/signup`, { username, email });
  }

  createUserPassword(password: string): Observable<UserAuth> {
    return this._http.post<UserAuth>(`${this._config.authUrl}/auth/reset-password`, { password });
  }

  signin(username: string, password: string): Observable<UserAuth> {
    return this._http.post<UserAuth>(`${this._config.authUrl}/signin`, { username, password });
  }

  getUserAuth(): Observable<UserAuth | null> {
    return new Observable(observer => {
      const userAuth: UserAuth = localStorage.getItem('userAuth') ? JSON.parse(localStorage.getItem('userAuth') as string) : null;
      observer.next(userAuth ? UserAuth.build(userAuth) : null);
    });
  }

  getCurrentUser(): Observable<User> {
    return this._http.get<User>(`${this._config.authUrl}/auth/current-user`);
  }
}
