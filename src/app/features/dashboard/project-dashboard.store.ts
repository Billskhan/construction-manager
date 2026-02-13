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

  // stageCostSummary = computed(() => {
  //   return this.stageStore.stages().map(stage => {
  //     const stageTx = this.txStore.transactions()
  //       .filter(t => t.stageId === stage.id);

  //     const actual = stageTx.reduce(
  //       (s, t) => s + t.totalAmount,
  //       0
  //     );

  //     return {
  //        stageId: stage.id,
  //       stage: stage.name,
  //       budget: stage.budget ?? 0,
  //       actual,
  //       variance: (stage.budget ?? 0) - actual,
  //     };
  //   });
  // });


totalBudget = computed(() =>
  this.stageStore.stages().reduce(
    (sum, s) => sum + (s.budget ?? 0),
    0
  )
);

budgetUtilization = computed(() => {
  const budget = this.totalBudget();
  const spent = this.totalSpent();
  if (!budget) return 0;
  return Math.round((spent / budget) * 100);
});

topVendors = computed(() => {

  const tx = this.txStore.transactions();

  const map = new Map<number, number>();

  for (const t of tx) {
    map.set(
      t.vendorId,
      (map.get(t.vendorId) ?? 0) + t.totalAmount
    );
  }

  return Array.from(map.entries())
    .map(([vendorId, total]) => ({
      vendorId,
      total
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
});













  stageCostSummary = computed(() => {

  const transactions = this.txStore.transactions();
  const stages = this.stageStore.stages();

  return stages.map(stage => {

    const stageId = stage.id ?? 0;
    const budget = stage.budget ?? 0;

    const actual = transactions
      .filter(t => t.stageId === stageId)
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      stageId,
      stage: stage.name,
      budget,
      actual,
      variance: budget - actual,
    };
  });
});

  recentTransactions = computed(() =>
    [...this.txStore.transactions()]
      .slice(0, 5)
  );
}
