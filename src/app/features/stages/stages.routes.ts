import { Routes } from '@angular/router';
import { StageListComponent } from './stage-list.component';
import { StageFormComponent } from './stage-form.component';
import { managerGuard } from '../../core/guards/manager.guard';

export const STAGE_ROUTES: Routes = [
  { path: '', component: StageListComponent },
  {
    path: 'add',
    component: StageFormComponent,
    canActivate: [managerGuard],
  },
];
