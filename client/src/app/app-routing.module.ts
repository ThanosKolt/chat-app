import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatMainComponent } from './components/chat-main/chat-main.component';
import { authguardGuard } from './shared/authGuard/authguard.guard';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
  },
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
