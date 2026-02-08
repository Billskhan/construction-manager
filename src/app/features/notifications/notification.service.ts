import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';
import { AppNotification } from '../../shared/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private sqlite: SQLiteService) {}

  async create(notification: AppNotification) {
    await this.sqlite.init();  
    await this.sqlite.database.run(
      `INSERT INTO notifications
       (userId, transactionId, title, message, isRead, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        notification.userId,
        notification.transactionId,
        notification.title,
        notification.message,
        notification.isRead ? 1 : 0,
        new Date().toISOString(),
      ]
    );
  }

  async getForUser(userId: number) {
    await this.sqlite.init();  
    const res = await this.sqlite.query(
      `SELECT * FROM notifications
       WHERE userId = ?
       ORDER BY createdAt DESC`,
      [userId]
    );
    return res.values || [];
  }

  async markAsRead(id: number) {
    await this.sqlite.database.run(
      `UPDATE notifications SET isRead = 1 WHERE id = ?`,
      [id]
    );
  }
}
