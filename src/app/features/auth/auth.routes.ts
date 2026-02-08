import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';

export const AUTH_ROUTES: Routes = [
    {
    path: '',
    component: LoginComponent,
  },
  { path: 'login', component: LoginComponent },
];
