import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuth } from '../models/auth/user-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _config = {
    authUrl: 'http://localhost:2020/authsrv'
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
}
