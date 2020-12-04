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
    const httpParam = new HttpParams().append('key', verifcationCode);
    return this._http.get<UserAuth>(`${this._config.authUrl}/verify`, { params: httpParam });
  }

  resendEmail(email: string): Observable<void> {
    if (email == null) {
      throw new Error('Email is required to resend verification code.');
    }
    return this._http.post<void>(`${this._config.authUrl}/verify/resend`, { email });
  }
}
