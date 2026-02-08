import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorStore } from './vendor.store';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorType } from '../../shared/models/vendor.model';

@Component({
  standalone: true,
  selector: 'app-vendor-form',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Add Vendor</h2>

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

      <label>
        Has App Installed?
        <input type="checkbox" [(ngModel)]="hasApp" name="hasApp" />
      </label>

      <button type="submit">Save</button>
    </form>
  `,
})
export class VendorFormComponent {

  projectId!: number;
  name = '';
  phone = '';
  vendorType: VendorType = 'Material';
  hasApp = false;

  constructor(
    private store: VendorStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
  }

  async save() {
    await this.store.add({
      projectId: this.projectId,
      name: this.name,
      phone: this.phone,
      vendorType: this.vendorType,
      hasApp: this.hasApp,
    });

    this.router.navigateByUrl(`/projects/${this.projectId}/vendors`);
  }
}
