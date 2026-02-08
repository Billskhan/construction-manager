import { Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list.component';
import { VendorFormComponent } from './vendor-form.component';
import { managerGuard } from '../../core/guards/manager.guard';
import { VendorDashboardComponent } from './vendor-dashboard.component';

export const VENDOR_ROUTES: Routes = [
  { path: '', component: VendorDashboardComponent  },
  {
    path: 'add',
    component: VendorFormComponent,
    canActivate: [managerGuard],
  },
];
