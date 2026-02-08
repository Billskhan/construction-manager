import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AcknowledgementStore } from '../acknowledgements/acknowledgement.store';
//import { VendorAcknowledgementsComponent }   from './vendor-acknowledgements.component';

@Component({
  standalone: true,
  selector: 'app-vendor-acknowledgements',
  template: `
    <h3>Pending Payment Confirmations</h3>

    @if (store.loading()) {
      <p>Loading...</p>
    }

    @if (!store.loading() && store.pending().length === 0) {
      <p>No pending confirmations.</p>
    }

    <ul>
      @for (a of store.pending(); track a.id) {
        <li>
          {{ a.date }} — PKR {{ a.totalAmount }}

          <button (click)="confirm(a.id)">Confirm</button>
          <button (click)="reject(a.id)">Reject</button>
        </li>
      }
    </ul>
  `,
})
export class VendorAcknowledgementsComponent implements OnInit {

  vendorId!: number;

  constructor(
    private auth: AuthService,
    public store: AcknowledgementStore
  ) {}

  ngOnInit() {
    this.vendorId = this.auth.user()!.vendorId!;
    this.store.load(this.vendorId);
  }

  confirm(id: number) {
    this.store.confirm(id, this.vendorId);
  }

  reject(id: number) {
    const comment = prompt('Reason for rejection?') || '';
    this.store.reject(id, this.vendorId, comment);
  }
}
