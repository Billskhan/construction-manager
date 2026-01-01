import { Routes } from '@angular/router';
import { TransactionListComponent } from './transaction-list.component';
import { TransactionFormComponent } from './transaction-form.component';
import { managerGuard } from '../../core/guards/manager.guard';

export const TRANSACTION_ROUTES: Routes = [
  { path: '', component: TransactionListComponent },
  {
    path: 'add',
    component: TransactionFormComponent,
    canActivate: [managerGuard],
  },
];
