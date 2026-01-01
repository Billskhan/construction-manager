import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; // './core/guards/auth.guard';

export const routes: Routes = [

  // 🔐 Login (PUBLIC)
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES),
  },

  // 🔁 Default entry
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // 🧭 Dashboard (PROTECTED)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/project-dashboard.routes')
        .then(m => m.PROJECT_DASHBOARD_ROUTES),
  },

  // 🏗️ Projects (PROTECTED)
  {
    path: 'projects',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/projects/projects.routes')
        .then(m => m.PROJECT_ROUTES),
  },

  // ❓ Fallback
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
