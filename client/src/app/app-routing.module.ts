import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { authguardGuard } from './authguard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ChatListComponent, canActivate: [authguardGuard] },
  {
    path: 'chat/:id',
    component: ChatMainComponent,
    canActivate: [authguardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AppRoutingModule {}
