import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationStore } from './features/notifications/notification.store';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
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
    }

    .notification-badge {
      background: red;
      border-radius: 50%;
      padding: 4px 8px;
      font-size: 12px;
    }
  `]
})
export class AppComponent {

  constructor(
    public notifications: NotificationStore,
    public auth: AuthService
  ) {

        // 🔑 RESTORE USER SESSION
    this.auth.restoreSession();
    // Load notifications only if user exists
    const user = this.auth.user();
    if (user) {
      this.notifications.load(user.id);
    }
  }
}
