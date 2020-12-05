import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatMessage } from '../models';
import { AuthService } from '../services/auth.service';
import { ChatServiceService } from '../services/chat-service.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatInput', { static: true })
  ChatInputElement!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messagesWrapper', { static: true })
  messagesWrapperElement!: ElementRef<HTMLDivElement>;

  @Input()
  roomName = 'global:chat:message';

  currentUserId!: string;

  @Input()
  messages: ChatMessage[] = [];

  pageSize = 10;
  pageIndex = 0;

  constructor(
    private _authService: AuthService,
    private _chatService: ChatServiceService
  ) { }

  ngOnInit(): void {
    this._authService.getUserAuth()
      .subscribe((userAuth) => {
        if (userAuth) {
          this.currentUserId = userAuth.userId;
        }
      });

    this.ChatInputElement.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.ChatInputElement.nativeElement.value = this.ChatInputElement.nativeElement.value + '\n';
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.sendMessage();
        this.ChatInputElement.nativeElement.value = '';
      }
    });
    this.listenToIncommingMessages();
  }

  ngAfterViewChecked(): void {
    // if (this.messagesWrapperElement.nativeElement.clientHeight > 0) {
    //   this.messagesWrapperElement.nativeElement.scroll({ top: this.messagesWrapperElement.nativeElement.offsetHeight });
    // }
  }

  loadMoreTen(): void {
    this.pageIndex++;
    this._chatService.getRoomMessages(this.roomName, { pageSize: this.pageSize, pageIndex: this.pageIndex })
    .subscribe((messages) => {
      this.messages.unshift(...messages);
    });
  }


  listenToIncommingMessages(): void {
    this._chatService.listenToRoom(this.roomName)
      .subscribe((message) => {
        this.messages.push(message);
      });
  }

  sendMessage(): void {
    if (this.ChatInputElement.nativeElement.value && this.ChatInputElement.nativeElement.value.trim().length !== 0) {
      const chatMessaeg = ChatMessage.build({
        message: this.ChatInputElement.nativeElement.value,
        userId: this.currentUserId,
        creationDate: new Date()
      });
      this._chatService.sendMessage(this.roomName, chatMessaeg)
        .subscribe((chatMessage) => {
          this.messages.push(chatMessaeg);
        });
    }
  }


}
