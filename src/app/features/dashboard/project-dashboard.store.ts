import { Injectable, computed } from '@angular/core';
import { TransactionStore } from '../transactions/transaction.store';
import { StageStore } from '../stages/stage.store';

@Injectable({ providedIn: 'root' })
export class ProjectDashboardStore {

  constructor(
    private txStore: TransactionStore,
    private stageStore: StageStore
  ) {}

  totalSpent = computed(() =>
    this.txStore.transactions().reduce(
      (sum, t) => sum + t.totalAmount,
      0
    )
  );

  totalCredit = computed(() =>
    this.txStore.transactions().reduce(
      (sum, t) => sum + t.creditAmount,
      0
    )
  );

  stageCostSummary = computed(() => {
    return this.stageStore.stages().map(stage => {
      const stageTx = this.txStore.transactions()
        .filter(t => t.stageId === stage.id);

      const actual = stageTx.reduce(
        (s, t) => s + t.totalAmount,
        0
      );

      return {
        stage: stage.name,
        budget: stage.budget ?? 0,
        actual,
        variance: (stage.budget ?? 0) - actual,
      };
    });
  });

  recentTransactions = computed(() =>
    [...this.txStore.transactions()]
      .slice(0, 5)
  );
}
