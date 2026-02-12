import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorStore } from './vendor.store';
import { VendorService } from './vendor.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Vendor Dashboard</h2>

    <!-- ACTION BAR -->
    <div class="actions" *ngIf="isManager">
      <button (click)="addVendor()">➕ Add Vendor</button>
      <button (click)="viewAll()">📋 All Vendors</button>
    </div>

    <hr />

    <!-- GLOBAL VENDORS -->
    <h3>🌍 Public Vendors</h3>
    <ul>
      @for (v of publicVendors; track v.id) {
        <li>
          <strong>{{ v.name }}</strong>
          ({{ v.vendorType }})
          <br />
          📞 {{ v.phone }}
        </li>
      }
    </ul>

    <hr />

    <!-- LOCAL PROJECT VENDORS -->
    <h3>📁 Project Vendors</h3>
    <ul>
      @for (v of projectVendors; track v.id) {
        <li>
          <strong>{{ v.name }}</strong>
          ({{ v.vendorType }})
          <br />
          📞 {{ v.phone }}

          <!-- <div *ngIf="isManager">
            <button (click)="removeFromProject(v.id)">❌ Remove</button>
          </div> -->
        </li>
      }
    </ul>
  `
})
export class VendorDashboardComponent implements OnInit {

  isManager = false;
  managerId!: number;

  projectVendors: any[] = [];
  publicVendors: any[] = [];

  constructor(
    private vendorService: VendorService,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {

    const user = this.auth.user();
    if (!user) return;

    this.isManager = user.role === 'MANAGER';
    if (!this.isManager) return;

    this.managerId = user.id!;

    await this.loadData();
  }

  async loadData() {
    this.projectVendors =
      await this.vendorService.getByManager(this.managerId);

    this.publicVendors =
      await this.vendorService.getGlobalForManager(this.managerId);
  }

  addVendor() {
    this.router.navigate(['/vendor/manage/add']);
  }

  viewAll() {
    this.router.navigate(['/vendor']);
  }
}
