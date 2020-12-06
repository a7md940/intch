import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../models';
import { ChatServiceService } from '../services/chat-service.service';
import { PagedList } from '../utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  roomName = 'global:chat:message';
  messages!: PagedList<ChatMessage>;

  constructor(private _chatService: ChatServiceService) { }

  ngOnInit(): void {
    this.getLatestMessages();
  }
  getLatestMessages(): void {
    this._chatService.getRoomMessages(this.roomName)
      .subscribe((pagedList) => this.messages = pagedList);
  }
}
