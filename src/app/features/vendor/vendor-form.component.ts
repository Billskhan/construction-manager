import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorStore } from './vendor.store';
import { VendorService } from './vendor.service';
import { AuthService } from '../../core/services/auth.service';
import { VendorType } from '../../shared/models/vendor.model';

@Component({
  standalone: true,
  selector: 'app-vendor-form',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>{{ vendorId ? 'Edit Vendor' : 'Add Vendor' }}</h2>

    <form (ngSubmit)="save()">

      <label>
        Name
        <input [(ngModel)]="name" name="name" required />
      </label>

      <label>
        Phone
        <input [(ngModel)]="phone" name="phone" required />
      </label>

      <label>
        Type
        <select [(ngModel)]="vendorType" name="vendorType">
          <option value="Material">Material</option>
          <option value="Contractor">Contractor</option>
          <option value="Service">Service</option>
        </select>
      </label>

      <!-- Manager only -->
      <label *ngIf="isManager">
        Public Profile
        <input type="checkbox"
               [(ngModel)]="isPublic"
               name="isPublic" />
      </label>

      <button type="submit">Save</button>

    </form>
  `,
})
export class VendorFormComponent {

  vendorId?: number;

  name = '';
  phone = '';
  vendorType: VendorType = 'Material';
  isPublic = false;

  isManager = false;

  constructor(
    private vendorService: VendorService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {

    const user = this.auth.user();
    this.isManager = user?.role === 'MANAGER';

    // 🔒 If Vendor role → force own vendorId
    if (user?.role === 'VENDOR') {
      this.vendorId = user.vendorId;
    } else {
      const id = this.route.snapshot.paramMap.get('vendorId');
      this.vendorId = id ? Number(id) : undefined;
    }

    if (this.vendorId) {
      const vendor = await this.vendorService.getById(this.vendorId);
      if (vendor) {
        this.name = vendor.name;
        this.phone = vendor.phone;
        this.vendorType = vendor.vendorType;
        this.isPublic = vendor.isPublic === 1;;
      }
    }
  }

  async save() {

    const user = this.auth.user();

    // 🔒 Security enforcement
    if (
      user?.role === 'VENDOR' &&
      user.vendorId !== this.vendorId
    ) {
      alert('Unauthorized access');
      return;
    }
    
    const isPublicValue = this.isManager
    ? (this.isPublic ? 1 : 0)
    : 0;

    if (this.vendorId) {
      await this.vendorService.update({
        id: this.vendorId,
        name: this.name,
        phone: this.phone,
        vendorType: this.vendorType,
        isPublic: isPublicValue
      });
    } else {
      await this.vendorService.create({
        name: this.name,
        phone: this.phone,
        vendorType: this.vendorType,
        isPublic: isPublicValue,
        createdBy: user?.id
      });
    }

    this.router.navigateByUrl('/vendors');
  }
}
