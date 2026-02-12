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
          📞 {{ v.phone }}

          <div *ngIf="isManager">
            <button (click)="makePublic(v)">🌍 Make Public</button>
            <button (click)="remove(v.id)">❌ Remove</button>
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
  `
})
export class VendorListComponent implements OnInit {

  projectId: number = 0;
  publicVendors: any[] = [];
  isManager = false;

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
    await this.vendorService.update({
      ...vendor,
      isPublic: 1
    });

    this.publicVendors =
      await this.vendorService.getPublicVendors();
  }
}
