import { Injectable, signal } from '@angular/core';
import { AcknowledgementService } from './acknowledgement.service';

@Injectable({ providedIn: 'root' })
export class AcknowledgementStore {

  pending = signal<any[]>([]);
  loading = signal(false);

  constructor(private service: AcknowledgementService) {}

  async load(vendorId: number) {
    this.loading.set(true);
    const res = await this.service.getPendingForVendor(vendorId);
    this.pending.set(res.values || []);
    this.loading.set(false);
  }

  async confirm(id: number, vendorId: number) {
    await this.service.confirm(id);
    await this.load(vendorId);
  }

  async reject(id: number, vendorId: number, comment: string) {
    await this.service.reject(id, comment);
    await this.load(vendorId);
  }
}
