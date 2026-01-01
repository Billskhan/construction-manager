import { Injectable, signal } from '@angular/core';
import { Vendor } from '../../shared/models/vendor.model';
import { VendorService } from './vendor.service';

@Injectable({ providedIn: 'root' })
export class VendorStore {

  vendors = signal<Vendor[]>([]);
  loading = signal(false);

  constructor(private service: VendorService) {}

  async load(projectId: number) {
    this.loading.set(true);
    const data = await this.service.getByProject(projectId);
    this.vendors.set(data);
    this.loading.set(false);
  }

  async add(vendor: Vendor) {
    await this.service.create(vendor);
    await this.load(vendor.projectId);
  }
}
