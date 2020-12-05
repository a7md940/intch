import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { filter, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { UserAuth } from '../models/auth/user-auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private _config = {
    socketChat: ''
  };
  socketClient!: Socket;

  constructor(private _authService: AuthService) {
    this._authService.getUserAuth()
      .pipe(filter(x => x != null), map(x => x as UserAuth))
      .subscribe((userAuth) => {
        this.socketClient = io(`/?auth=${userAuth.token}`, { path: '/realtime', transports: ['websocket'] });
      });

  }
  sendMessage(event: string, payload: any): void {
    this.socketClient.emit(event, payload);
  }

  listen<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      this.socketClient.on(event, (message: T) => {
        observer.next(message);
      });
    });
  }
}
