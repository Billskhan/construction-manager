import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <h2>Login</h2>

    <button (click)="loginManager()">Login as Manager</button>
    <button (click)="loginVendor()">Login as Vendor</button>
  `,
})
export class LoginComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  loginManager() {
    const user: User = {
      id: 1,
      name: 'Project Manager',
      phone: '0300xxxxxxx',
      role: 'MANAGER',
    };
    this.auth.login(user);
    this.router.navigateByUrl('/dashboard');
  }

  loginVendor() {
    const user: User = {
      id: 2,
      name: 'Vendor',
      phone: '0301xxxxxxx',
      role: 'VENDOR',
    };
    this.auth.login(user);
    this.router.navigateByUrl('/dashboard');
  }
}
