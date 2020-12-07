import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '../models';
import { User } from '../models/user';

interface IChatMessageItem extends ChatMessage {
  user: User;
}
@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {
  @Input()
  bgColor = '#333';

  @Input()
  chatMessage!: IChatMessageItem;

  @Input()
  currentUserId!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
