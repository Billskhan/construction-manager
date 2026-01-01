import { Injectable, signal, computed } from '@angular/core';
import { NotificationService } from './notification.service';
import { AppNotification } from '../../shared/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationStore {

  notifications = signal<AppNotification[]>([]);

  constructor(private service: NotificationService) {}

  async load(userId: number) {
    this.notifications.set(await this.service.getForUser(userId));
  }

  unreadCount = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );

  async markRead(notification: AppNotification) {
    if (!notification.id) return;
    await this.service.markAsRead(notification.id);
    await this.load(notification.userId);
  }
}
