import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '../models';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {
  @Input()
  bgColor = '#333';

  @Input()
  chatMessage!: ChatMessage;
  constructor() { }

  ngOnInit(): void {
  }

}
