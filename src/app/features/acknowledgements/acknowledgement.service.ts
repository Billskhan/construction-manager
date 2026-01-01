import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';

@Injectable({ providedIn: 'root' })
export class AcknowledgementService {

  constructor(private sqlite: SQLiteService) {}

  async confirm(transactionId: number) {
    await this.sqlite.database.run(
      `UPDATE acknowledgements
       SET status = 'CONFIRMED',
           acknowledgedAt = CURRENT_TIMESTAMP
       WHERE transactionId = ?`,
      [transactionId]
    );
  }
}
