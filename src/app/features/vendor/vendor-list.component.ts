import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorStore } from './vendor.store';
import { VendorService } from './vendor.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-vendor-list',
  imports: [CommonModule],
  template: `
    <h2>Project Vendors</h2>

    <button *ngIf="isManager" (click)="add()">+ Add Vendor</button>

    <div *ngIf="store.loading()">Loading...</div>

    <ul>
      @for (v of store.vendors(); track v.id) {
        <li>
          <strong>{{ v.name }}</strong>
          <small>({{ v.vendorType }})</small>
          <br />

          <div *ngIf="v.id && getFinancial(v.id) as f" class="financial-box">
            💰 Paid: {{ f.totalPaid || 0 }}
            <br />
            🧾 Credit: {{ f.totalCredit || 0 }}
            <br />
            📊 Transactions: {{ f.txCount || 0 }}
          </div>
          
          <div *ngIf="v.contactNumber1">
            📞 {{ v.contactNumber1 }}
          </div>

          <div *ngIf="isManager">
            <button *ngIf="v.id"
                    (click)="remove(v.id)">
              ❌ Remove
            </button>
          </div>
        </li>
      }
    </ul>


    <hr />

    <h3 *ngIf="isManager">Public Vendors</h3>

    <ul *ngIf="isManager">
      @for (v of publicVendors; track v.id) {
        <li>
          {{ v.name }} ({{ v.vendorType }})

          <button (click)="addToProject(v.id)">
            ➕ Add To Project
          </button>
        </li>
      }
    </ul>
  `,
      styles: [`
    .financial-box {
      margin-top: 6px;
      padding: 6px 10px;
      background: #f4f6f8;
      border-radius: 6px;
      font-size: 13px;
      color: #444;
    }
    `]
})
export class VendorListComponent implements OnInit {

  projectId: number = 0;
  publicVendors: any[] = [];
  isManager = false;
  vendorFinancials: any[] = [];

  constructor(
    public store: VendorStore,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  async ngOnInit() {

    this.projectId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.isManager =
      this.auth.user()?.role === 'MANAGER';

    await this.store.loadByProject(this.projectId);
    this.vendorFinancials = await this.vendorService.getFinancialSummaryByProject(this.projectId);
    console.log('Financial Summary:', this.vendorFinancials);
    
    if (this.isManager) {
      this.publicVendors =
        await this.vendorService.getPublicVendors();

    }
  }

  add() {
    this.router.navigateByUrl(
      `/projects/${this.projectId}/vendors/add`
    );
  }

  async addToProject(vendorId: number) {
    await this.vendorService.attachToProject(
      this.projectId,
      vendorId
    );
    await this.store.loadByProject(this.projectId);
  }

  async remove(vendorId: number) {
    await this.vendorService.detachFromProject(
      this.projectId,
      vendorId
    );
    await this.store.loadByProject(this.projectId);
  }

  async makePublic(vendor: any) {

    const user = this.auth.user();
    if (!user || user.role !== 'MANAGER') return;

    await this.vendorService.update(
      {
        ...vendor,
        isPublic: 1
      },
      user.id!   // required because update now needs managerId
    );

    this.publicVendors =
      await this.vendorService.getPublicVendors();
  }
  getFinancial(vendorId: number) {
    return this.vendorFinancials.find(
      v => v.vendorId === vendorId
        );
      }
  }
