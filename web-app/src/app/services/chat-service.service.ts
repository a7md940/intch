import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models';
import { SocketService } from './socket.service';

interface IPaginationOptions {
  pageSize: number;
  pageIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  private _config = {
    chatUrl: '/chatsrv'
  };

  constructor(private _socketService: SocketService, private _http: HttpClient) {
  }

  sendMessage(roomName: string, message: ChatMessage): Observable<ChatMessage> {
    const requestDto = { roomName, ...message };
    this._socketService.sendMessage(roomName, message);
    return this._http.post<ChatMessage>(
      `${this._config.chatUrl}/message/create`,
      requestDto
    );
  }

  listenToRoom(roomName: string): Observable<ChatMessage> {
    return this._socketService.listen<ChatMessage>(roomName);
  }

  getRoomMessages(roomName: string, pationationOptions: IPaginationOptions | null = null): Observable<ChatMessage[]> {
    let params = new HttpParams().append('roomName', roomName);


    if (pationationOptions != null) {
      const { pageSize, pageIndex } = pationationOptions;
      params = params.append('pageSize', pageSize.toString());
      params = params.append('pageIndex', pageIndex.toString());
    } else {
      params = params.append('topTen', 'true');
    }

    return this._http.get<ChatMessage[]>(`${this._config.chatUrl}/message`, { params });
  }

}
