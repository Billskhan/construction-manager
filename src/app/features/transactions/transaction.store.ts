import { Injectable, signal, computed } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionItem } from '../../shared/models/transaction-item.model';
import { TransactionService } from './transaction.service';
import { VendorService } from '../vendors/vendor.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable({ providedIn: 'root' })
export class TransactionStore {

  transactions = signal<Transaction[]>([]);
  loading = signal(false);

  constructor(
    private service: TransactionService,
    private vendorService: VendorService,
    private notificationService: NotificationService

) {}

  async load(projectId: number) {
    this.loading.set(true);
    const data = await this.service.getByProject(projectId);
    this.transactions.set(data);
    this.loading.set(false);
  }

  async add(tx: Transaction, items: TransactionItem[]) {
      // 1️⃣ Save transaction and CAPTURE ID
  const transactionId = await this.service.create(tx, items);
     // 2️⃣ Reload list
    await this.load(tx.projectId);
      // 3️⃣ Load vendor
  const vendor =
    await this.vendorService.getById(tx.vendorId);
     // 4️⃣ Optional notification
  if (vendor?.hasApp && vendor.userId) {

    await this.notificationService.create({
      userId: vendor.userId,
      transactionId: transactionId,
      title: 'Payment Received',
      message: `You received PKR ${tx.totalAmount}. Please confirm.`,
      isRead: false,
  });
}

  }

  totalSpent = computed(() =>
    this.transactions().reduce((s, t) => s + t.totalAmount, 0)
  );

  totalCredit = computed(() =>
    this.transactions().reduce((s, t) => s + t.creditAmount, 0)
  );
}
