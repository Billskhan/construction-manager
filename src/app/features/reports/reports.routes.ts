import { Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { managerGuard } from '../../core/guards/manager.guard';

export const REPORT_ROUTES: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [managerGuard],
  },
  {
  path: ':id/reports',
  loadChildren: () =>
    import('./reports.routes')
      .then(m => m.REPORT_ROUTES),
}

];
