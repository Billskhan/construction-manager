import { Injectable, signal, computed } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionItem } from '../../shared/models/transaction-item.model';
import { TransactionService } from './transaction.service';
import { VendorService } from '../vendor/vendor.service';
import { NotificationService } from '../notifications/notification.service';
import { SQLiteService } from '../../core/services/sqlite.service';

@Injectable({ providedIn: 'root' })
export class TransactionStore {

  transactions = signal<Transaction[]>([]);
  loading = signal(false);

  constructor(
    private service: TransactionService,
    private notificationService: NotificationService,
    private sqlite: SQLiteService

) {}

  async load(projectId: number) {
    this.loading.set(true);
    const data = await this.service.getByProject(projectId);
      this.transactions.set(
    data.map(t => ({
      ...t,
      ackStatus: t.ackStatus ?? 'PENDING',
    }))
  );
    this.loading.set(false);
  }

async add(tx: Transaction, items: TransactionItem[]) {

  const transactionId =
    await this.service.create(tx, items);

  await this.load(tx.projectId);

  const userRes = await this.sqlite.query(
    `SELECT id FROM users WHERE vendorId = ?`,
    [tx.vendorId]
  );

  const vendorUserId = userRes.values?.[0]?.id;

  if (vendorUserId) {
    await this.notificationService.create({
      userId: vendorUserId,
      transactionId,
      title: 'New Transaction',
      message: `You received PKR ${tx.totalAmount}. Please confirm.`,
      isRead: false,
    });
  }
}

  totalCredit = computed(() =>
    this.transactions().reduce((s, t) => s + t.creditAmount, 0)
  );
}
