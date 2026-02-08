import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';

@Injectable({ providedIn: 'root' })
export class ReportService {

  constructor(private sqlite: SQLiteService) {}

  async financialSummary(projectId: number) {
    const res = await this.sqlite.query(
      `SELECT
        SUM(totalAmount) as totalSpent,
        SUM(creditAmount) as totalCredit,
        SUM(totalAmount - creditAmount) as totalPaid
       FROM transactions
       WHERE projectId = ?`,
      [projectId]
    );
    return res.values?.[0];
  }

  async materialSummary(projectId: number) {
    const res = await this.sqlite.query(
      `SELECT
        itemName,
        unit,
        SUM(quantity) as totalQuantity,
        SUM(amount) as totalCost
       FROM transaction_items ti
       JOIN transactions t ON t.id = ti.transactionId
       WHERE t.projectId = ?
       AND t.entryType = 'Material'
       GROUP BY itemName, unit`,
      [projectId]
    );
    return res.values || [];
  }

  async stageSummary(projectId: number) {
    const res = await this.sqlite.query(
      `SELECT
        s.name as stage,
        s.budget,
        SUM(t.totalAmount) as actual
       FROM stages s
       LEFT JOIN transactions t ON t.stageId = s.id
       WHERE s.projectId = ?
       GROUP BY s.id
       ORDER BY s.sequence`,
      [projectId]
    );
    return res.values || [];
  }
}
