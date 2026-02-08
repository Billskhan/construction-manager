import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationStore } from './features/notifications/notification.store';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <header class="app-header">
      <h1>Construction Expense Manager</h1>

      @if (auth.user()) {
        <div class="notification-badge">
          🔔 {{ notifications.unreadCount() }}
        </div>
      }
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #1e293b;
      color: white;
      box-sizing: border-box;
    }
  `]
})
export class AppComponent {

  constructor(
    public notifications: NotificationStore,
    public auth: AuthService
  ) {
    // Now safe — SQLite is already ready
    this.auth.restoreSession();

    const user = this.auth.user();
    if (user) {
      this.notifications.load(user.id);
    }
  }
}
