import { Component } from "@angular/core";
import { NotificationListComponent } from "../notifications/notification-list.component";
import { VendorAcknowledgementsComponent } from "./vendor-acknowledgements.component";

@Component({
  standalone: true,
  template: `
    <h2>Vendor Dashboard</h2>

    <app-notifications></app-notifications>
    <app-vendor-acknowledgements></app-vendor-acknowledgements>
  `,
  imports: [NotificationListComponent, VendorAcknowledgementsComponent],
})
export class VendorDashboardComponent {}
