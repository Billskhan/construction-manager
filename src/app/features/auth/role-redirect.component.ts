import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  template: `<p>Redirecting...</p>`,
})
export class RoleRedirectComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.user();

    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }

    switch (user.role) {
      case 'MANAGER':
        this.router.navigateByUrl('/manager');
        break;
      case 'VENDOR':
        this.router.navigateByUrl('/vendor');
        break;
      case 'STAKEHOLDER':
        this.router.navigateByUrl('/stakeholder');
        break;
      default:
        this.router.navigateByUrl('/login');
    }
  }
}
