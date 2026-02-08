import { ActivatedRoute, Router } from "@angular/router";
import { TransactionStore } from "./transaction.store";
import { AuthService } from "../../core/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
 
  selector: 'app-transaction-list',
     imports: [CommonModule],
  template: `
    <h2>Transactions</h2>

    <!-- ADD TRANSACTION (MANAGER ONLY) -->
    @if (auth.isManager()) {
      <button (click)="add()">+ Add Transaction</button>
    }

    <!-- LOADING STATE -->
    @if (store.loading()) {
      <div>Loading...</div>
    }

    <!-- TRANSACTION LIST -->
    <ul>
      @for (t of store.transactions(); track t.id) {
        <li>
          {{ t.date }} —
          Total: {{ t.totalAmount }} |
          Credit: {{ t.creditAmount }}

          <!-- ACK STATUS -->
          @if (!auth.isVendor()) {
            <span style="margin-left: 8px">
              Status:
              @if (t.ackStatus === 'CONFIRMED') {
                <span style="color: green">✅ Confirmed</span>
              } @else if (t.ackStatus === 'REJECTED') {
                <span style="color: red">❌ Rejected</span>
              } @else {
                <span style="color: orange">⏳ Pending</span>
              }
            </span>
          }
        </li>
      }
    </ul>
  `,
})
export class TransactionListComponent implements OnInit {

  projectId!: number;

  constructor(
    public store: TransactionStore,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.load(this.projectId);
  }

  add() {
    this.router.navigateByUrl(
      `/projects/${this.projectId}/transactions/add`
    );
  }
}
