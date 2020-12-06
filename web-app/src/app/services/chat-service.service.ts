import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatMessage } from '../models';
import { PagedList } from '../utils';
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

  getRoomMessages(roomName: string, pationationOptions: IPaginationOptions | null = null): Observable<PagedList<ChatMessage>> {
    let params = new HttpParams().append('roomName', roomName);


    if (pationationOptions != null) {
      const { pageSize, pageIndex } = pationationOptions;
      params = params.append('pageSize', pageSize.toString());
      params = params.append('pageIndex', pageIndex.toString());
    }
    return this._http.get<PagedList<ChatMessage>>(`${this._config.chatUrl}/message`, { params })
      .pipe(map(resp => PagedList.build(resp)));
  }

}
