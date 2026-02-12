import { Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list.component';
import { VendorFormComponent } from './vendor-form.component';
import { VendorDashboardComponent } from './vendor-dashboard.component';
import { managerGuard } from '../../core/guards/manager.guard';
import { vendorGuard } from '../../core/guards/vendor.guard';

export const VENDOR_ROUTES: Routes = [

  // 🔹 Manager Side (Project-based)
  {
    path: '',
    component: VendorListComponent,
    canActivate: [managerGuard]
  },
  {
    path: 'add',
    component: VendorFormComponent,
    canActivate: [managerGuard]
  },
  {
    path: 'edit/:vendorId',
    component: VendorFormComponent,
    canActivate: [managerGuard]
  },

  // 🔹 Vendor Portal Side
  {
    path: 'dashboard',
    component: VendorDashboardComponent,
    //canActivate: [vendorGuard]
  }

];
