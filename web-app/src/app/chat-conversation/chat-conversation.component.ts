import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatMessage } from '../models';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ChatServiceService } from '../services/chat-service.service';
import { SocketService } from '../services/socket.service';
import { PagedList } from '../utils';

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
  messages!: PagedList<ChatMessage>;

  pageIndex = 0;
  totalCount = 0;

  pageSize = 10;

  scrolledToBottom = false;
  currentUser!: User;
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

    this._authService.getCurrentUser()
      .subscribe((currentUser) => {
        this.currentUser = currentUser;
      })

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
    const landingState = !this.scrolledToBottom;
    const { scrollHeight, clientHeight } = this.messagesWrapperElement.nativeElement;
    const messageWrapperScrollable = scrollHeight > clientHeight;

    if (landingState && messageWrapperScrollable) {
      this.scrollMessagesWrapperToBottom();
      this.scrolledToBottom = true;
    }
  }
  scrollMessagesWrapperToBottom(): void {
    setTimeout(() => this.messagesWrapperElement.nativeElement
      .scroll({
        top: this.messagesWrapperElement.nativeElement.scrollHeight,
        behavior: 'auto'
      })
    );
  }
  loadMoreTen(): void {
    this.pageIndex++;
    if (this.messages.count && this.messages.count > this.messages.pageSize * this.pageIndex) {
      this._chatService.getRoomMessages(this.roomName, { pageSize: this.pageSize, pageIndex: this.pageIndex })
        .subscribe((pagedList) => {
          this.pageSize = pagedList.pageSize;
          this.totalCount = pagedList.count;
          this.messages.collection.unshift(...pagedList.collection);
          const firstDivElement = this.messagesWrapperElement.nativeElement
            .querySelector('div:first-of-type') as HTMLDivElement;
          setTimeout(() => this.messagesWrapperElement.nativeElement.scroll({ top: firstDivElement.offsetTop, behavior: 'auto' }));
          console.dir();
        });
    }
  }


  listenToIncommingMessages(): void {
    this._chatService.listenToRoom(this.roomName)
      .subscribe((message) => this._pushNewMessage(message));
  }

  sendMessage(): void {
    if (this.ChatInputElement.nativeElement.value && this.ChatInputElement.nativeElement.value.trim().length !== 0) {
      const newChatMessage = ChatMessage.build({
        message: this.ChatInputElement.nativeElement.value,
        userId: this.currentUserId,
        creationDate: new Date(),
        user: Object.assign(this.currentUser)
      });
      this._chatService.sendMessage(this.roomName, newChatMessage)
        .subscribe((chatMessage) => this._pushNewMessage(chatMessage));
    }
  }

  private _pushNewMessage(message: ChatMessage): void {
    if (Array.isArray(this.messages.collection)) {
      this.messages.collection.push(message);
      this.scrollMessagesWrapperToBottom();
    }
  }

}
