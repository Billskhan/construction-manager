import { Routes } from "@angular/router";
import { managerGuard } from "../../core/guards/manager.guard";
import { vendorGuard } from "../../core/guards/vendor.guard";
import { VendorDashboardComponent } from "./vendor-dashboard.component";
import { VendorFormComponent } from "./vendor-form.component";
import { VendorListComponent } from "./vendor-list.component";

export const VENDOR_ROUTES: Routes = [

  // =============================
  // 🔹 VENDOR PORTAL
  // =============================
  {
    path: 'dashboard',
    component: VendorDashboardComponent,
    canActivate: [vendorGuard]
  },

  // =============================
  // 🔹 MANAGER GLOBAL VENDORS
  // =============================
  {
    path: 'manage',
    component: VendorListComponent,
    canActivate: [managerGuard]
  },
  {
    path: 'manage/add',
    component: VendorFormComponent,
    canActivate: [managerGuard]
  },
  {
    path: 'manage/edit/:vendorId',
    component: VendorFormComponent,
    canActivate: [managerGuard]
  },

];

