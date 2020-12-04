import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
