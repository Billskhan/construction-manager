import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionStore } from './transaction.store';
import { AuthService } from '../../core/services/auth.service';
import { TransactionItem } from '../../shared/models/transaction-item.model';
import { PROJECT_STAGES } from '../../shared/constants/project-stages';
import { VendorService } from '../vendor/vendor.service';
import { StageStore } from '../stages/stage.store';

@Component({
  standalone: true,
  selector: 'app-transaction-form',
  imports: [FormsModule],
  template: `
    <h2>Add Transaction</h2>

    <form (ngSubmit)="save()">

      <label>
        Vendor
        <select [(ngModel)]="vendorId" name="vendor" required>
          <option [ngValue]="null">Select Vendor</option>

          @for (v of vendors; track v.id) {
            <option [ngValue]="v.id">
              {{ v.name }} ({{ v.vendorType }})
            </option>
          }
        </select>
      </label>

      <label>
        Date
        <input type="date" [(ngModel)]="date" name="date" required />
      </label>

      <label>
        Credit (Unpaid)
        <input type="number" [(ngModel)]="creditAmount" name="credit" />
      </label>

      <label>
        Stage
        <select [(ngModel)]="stageId" name="stage" required>
          <option [ngValue]="null">Select Stage</option>

          @for (s of stageStore.stages(); track s.id) {
            <option [ngValue]="s.id">{{ s.name }}</option>
          }
        </select>
      </label>

      <h3>Items</h3>
      <button type="button" (click)="addItem()">+ Item</button>

      @for (i of items; track $index) {
        <div>
          <input
            placeholder="Item"
            [(ngModel)]="i.itemName"
            name="item{{$index}}"
          />

          <input
            type="number"
            placeholder="Qty"
            [(ngModel)]="i.quantity"
            name="qty{{$index}}"
            (input)="recalculateItem(i)"
          />

          <input
            type="number"
            placeholder="Rate"
            [(ngModel)]="i.rate"
            name="rate{{$index}}"
            (input)="recalculateItem(i)"
          />

          <span>Amount: {{ i.amount }}</span>
        </div>
      }

      <p><strong>Total Amount:</strong> {{ totalAmount }}</p>

      <!-- ✅ CORRECT BUTTON PLACEMENT -->
      <button
        type="submit"
        [disabled]="!isValid()">
        Save Transaction
      </button>

    </form>
  `,
})
export class TransactionFormComponent {

  projectId!: number;
  date = '';
  creditAmount = 0;
  totalAmount = 0;
  items: TransactionItem[] = [];

  //stages = PROJECT_STAGES;
  stageId: number | null = null;
  vendorId: number | null = null;
vendors: any[] = [];




  constructor(
    private store: TransactionStore,
    public stageStore: StageStore,
    private vendorService: VendorService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
  }

  addItem() {
    this.items.push({
      category: '',
      subCategory: '',
      itemName: '',
      quantity: 0,
      unit: '',
      rate: 0,
      amount: 0,
    });
  }
async ngOnInit() {
  this.vendors = await this.vendorService.getAll();
   const projectId = Number(this.route.snapshot.paramMap.get('id'));
   await this.stageStore.load(projectId);
   console.log('TX FORM projectId:', this.projectId);
  //this.vendors = await this.vendorService.getByProject(projectId);
}
  recalculateItem(item: TransactionItem) {
    item.amount = (item.quantity || 0) * (item.rate || 0);
    this.recalculateTotal();
  }

  recalculateTotal() {
    this.totalAmount = this.items.reduce(
      (sum, i) => sum + (i.amount || 0),
      0
    );
  }

  // isValid(): boolean {
  //   return (
  //       !!this.date &&
  //       !!this.stageId &&
  //       !!this.vendorId &&
  //       this.items.length > 0 &&
  //       this.totalAmount > 0
  //   );
  // }

  isValid(): boolean {
  return (
    !!this.date &&
    !!this.stageId &&
    !!this.vendorId &&
    this.items.length > 0 &&
    this.items.every(i =>
      i.itemName?.trim() &&
      i.quantity > 0 &&
      i.rate > 0
    ) &&
    this.totalAmount > 0
  );
}

  async save() {
    await this.store.add(
      {
        projectId: this.projectId,
        stageId: this.stageId!,
        vendorId: this.vendorId!,
        date: this.date,
        entryType: 'Material',
        paymentMode: 'Cash',
        totalAmount: this.totalAmount,
        creditAmount: this.creditAmount,
        createdBy: this.auth.user()?.id,
      },
      this.items
    );

    this.router.navigateByUrl(
      `/projects/${this.projectId}/transactions`
    );
  }
}
