import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuth } from '../models/auth/user-auth';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private _config = {
    authUrl: 'http://localhost:2020/authsrv'
  };

  constructor(private _http: HttpClient) {

  }
  verifyEmail(verifcationCode: string): Observable<UserAuth> {
    let httpParam = new HttpParams().append('key', verifcationCode);
    return this._http.get<UserAuth>(`${this._config.authUrl}/auth/verify`, { params: httpParam });
  }
}
