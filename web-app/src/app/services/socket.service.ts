import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private _config = {
    socketChat: ''
  };
  io: Socket;
  constructor() {
    this.io = io('', { path: '/realtime', transports: ['websocket'] });
    console.log('socket initialized!');
  }
}
