import { Injectable, signal } from '@angular/core';
import { Vendor } from '../../shared/models/vendor.model';
import { VendorService } from './vendor.service';

@Injectable({ providedIn: 'root' })
export class VendorStore {

  vendors = signal<Vendor[]>([]);
  loading = signal(false);

  constructor(private service: VendorService) {}

  async loadAll() {
    this.loading.set(true);
    const data = await this.service.getAll();
    this.vendors.set(data);
    this.loading.set(false);
  }

  async loadByProject(projectId: number) {
    this.loading.set(true);
    const data = await this.service.getByProject(projectId);
    this.vendors.set(data);
    this.loading.set(false);
  }

  async add(vendor: Vendor) {
    await this.service.create(vendor);
    await this.loadAll();  // ✅ reload global list
  }

  async delete(id: number) {
    await this.service.delete(id);
    await this.loadAll();
  }
}
