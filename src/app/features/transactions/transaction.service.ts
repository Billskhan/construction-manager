import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionItem } from '../../shared/models/transaction-item.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {

  constructor(private sqlite: SQLiteService) {}

  async getByProject(projectId: number): Promise<Transaction[]> {
    const res = await this.sqlite.database.query(
      `SELECT * FROM transactions WHERE projectId = ? ORDER BY date DESC`,
      [projectId]
    );
    return res.values || [];
  }

  async create(tx: Transaction, items: TransactionItem[]): Promise<number> {
    const result = await this.sqlite.database.run(
      `INSERT INTO transactions 
       (projectId, stageId, vendorId, date, entryType, paymentMode, totalAmount, creditAmount, comments, createdBy, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tx.projectId,
        tx.stageId,
        tx.vendorId,
        tx.date,
        tx.entryType,
        tx.paymentMode,
        tx.totalAmount,
        tx.creditAmount,
        tx.comments ?? '',
        tx.createdBy ?? null,
        new Date().toISOString(),
      ]
     
    );

    const transactionId = result.changes?.lastId!;

    for (const item of items) {
      await this.sqlite.database.run(
        `INSERT INTO transaction_items
         (transactionId, category, subCategory, itemName, quantity, unit, length, rate, carriage, amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transactionId,
          item.category,
          item.subCategory,
          item.itemName,
          item.quantity,
          item.unit,
          item.length ?? null,
          item.rate,
          item.carriage ?? 0,
          item.amount,
        ]
      );
    }
    // after inserting transaction + items
await this.sqlite.database.run(
  `INSERT INTO acknowledgements
   (transactionId, status, method)
   VALUES (?, 'PENDING', 'APP')`,
  [transactionId]
);
 return transactionId!;
  }
}
