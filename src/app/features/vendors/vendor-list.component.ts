import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorStore } from './vendor.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-vendor-list',
  imports: [CommonModule],
  template: `
    <h2>Vendors</h2>

    <button (click)="add()">+ Add Vendor</button>

    <div *ngIf="store.loading()">Loading...</div>

    <ul>
      <li *ngFor="let v of store.vendors()">
        <strong>{{ v.name }}</strong>
        <small>({{ v.vendorType }})</small>
        <br />
        📞 {{ v.phone }}
      </li>
    </ul>
  `,
})
export class VendorListComponent implements OnInit {

  projectId!: number;

  constructor(
    public store: VendorStore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.load(this.projectId);
  }

  add() {
    this.router.navigateByUrl(`/projects/${this.projectId}/vendors/add`);
  }
}
