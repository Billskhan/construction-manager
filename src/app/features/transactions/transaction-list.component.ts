import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionStore } from './transaction.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-transaction-list',
  imports: [CommonModule],
  template: `
    <h2>Transactions</h2>

    <button (click)="add()">+ Add Transaction</button>

    <div *ngIf="store.loading()">Loading...</div>

    <ul>
      <li *ngFor="let t of store.transactions()">
        {{ t.date }} —
        Total: {{ t.totalAmount }} |
        Credit: {{ t.creditAmount }}
      </li>
    </ul>
  `,
})
export class TransactionListComponent implements OnInit {

  projectId!: number;

  constructor(
    public store: TransactionStore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.load(this.projectId);
  }

  add() {
    this.router.navigateByUrl(`/projects/${this.projectId}/transactions/add`);
  }
}
