import { Routes } from '@angular/router';
import { ProjectListComponent } from './project-list.component';
import { ProjectFormComponent } from './project-form.component';
import { managerGuard } from '../../core/guards/manager.guard' ; 
import { ProjectDashboardComponent } from '../dashboard/project-dashboard.component';

export const PROJECT_ROUTES: Routes = [
  { path: '', component: ProjectListComponent },
  {
    path: 'add',
    component: ProjectFormComponent,
    canActivate: [managerGuard],
  },
  {
  path: ':id/vendors',
  loadChildren: () =>
    import('../vendors/vendors.routes')
      .then(m => m.VENDOR_ROUTES),
  },
  {
  path: ':id/transactions',
  loadChildren: () =>
    import('../transactions/transactions.routes')
      .then(m => m.TRANSACTION_ROUTES),
},
{
  path: ':id/stages',
  loadChildren: () =>
    import('../stages/stages.routes')
      .then(m => m.STAGE_ROUTES),
},
{
  path: ':id',
  component: ProjectDashboardComponent,
}



];
