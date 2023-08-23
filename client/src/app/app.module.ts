import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatMainComponent } from './components/chat-main/chat-main.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { RegisterComponent } from './components/register/register.component';
import { TokenInterceptor } from './shared/tokenInterceptor/token.interceptor';
import { JwtInterceptor } from './shared/jwtInterceptor/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    ChatListComponent,
    LoginComponent,
    ChatMainComponent,
    SideBarComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
