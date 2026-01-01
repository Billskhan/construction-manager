import { Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list.component';
import { VendorFormComponent } from './vendor-form.component';
import { managerGuard } from '../../core/guards/manager.guard';

export const VENDOR_ROUTES: Routes = [
  { path: '', component: VendorListComponent },
  {
    path: 'add',
    component: VendorFormComponent,
    canActivate: [managerGuard],
  },
];
