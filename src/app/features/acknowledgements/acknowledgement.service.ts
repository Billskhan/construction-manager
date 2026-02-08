import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';

@Injectable({ providedIn: 'root' })
export class AcknowledgementService {

  constructor(private sqlite: SQLiteService) {}

  getPendingForVendor(vendorId: number) {
    return this.sqlite.query(
      `
      SELECT a.id, a.transactionId, t.totalAmount, t.date
      FROM acknowledgements a
      JOIN transactions t ON t.id = a.transactionId
      WHERE t.vendorId = ?
        AND a.status = 'PENDING'
      ORDER BY t.date DESC
      `,
      [vendorId]
    );
  }

  confirm(id: number) {
    return this.sqlite.database.run(
      `
      UPDATE acknowledgements
      SET status = 'CONFIRMED',
          acknowledgedAt = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [id]
    );
  }

  reject(id: number, comment: string) {
    return this.sqlite.database.run(
      `
      UPDATE acknowledgements
      SET status = 'REJECTED',
          comment = ?,
          acknowledgedAt = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [comment, id]
    );
  }
}
