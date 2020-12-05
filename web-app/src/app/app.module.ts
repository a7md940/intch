import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VerificationComponent } from './verification/verification.component';
import { ResendVerificationComponent } from './resend-verification/resend-verification.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ChatConversationComponent } from './chat-conversation/chat-conversation.component';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { MessageItemComponent } from './message-item/message-item.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    VerificationComponent,
    ResendVerificationComponent,
    ResetPasswordComponent,
    LoginComponent,
    HomeComponent,
    ChatConversationComponent,
    ChatUserListComponent,
    MessageItemComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
