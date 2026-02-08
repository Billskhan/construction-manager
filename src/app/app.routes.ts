import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { SqliteReadyGuard } from './core/guards/sqlite-ready.guard';
import { RoleRedirectComponent } from './features/auth/role-redirect.component';

export const routes: Routes = [

  // 🔓 PUBLIC: Login
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES),
  },

  // 🔐 PROTECTED AREA (SQLite + Auth required)
  {
    path: '',
    canActivate: [SqliteReadyGuard, authGuard],
    children: [

      // 🔁 Redirect user based on role
      {
        path: '',
        component: RoleRedirectComponent,
      },

      // 📊 Dashboard
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/project-dashboard.routes')
            .then(m => m.PROJECT_DASHBOARD_ROUTES),
      },

      // 🏗️ Projects
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/projects/projects.routes')
            .then(m => m.PROJECT_ROUTES),
      },

      // 👨‍💼 Manager
      {
        path: 'manager',
        loadChildren: () =>
          import('./features/manager/manager.routes')
            .then(m => m.MANAGER_ROUTES),
      },

      // 🧾 Vendor
      {
        path: 'vendor',
        loadChildren: () =>
          import('./features/vendor/vendor.routes')
            .then(m => m.VENDOR_ROUTES),
      },

      // 👀 Stakeholder
      {
        path: 'stakeholder',
        loadChildren: () =>
          import('./features/stakeholder/stakeholder.routes')
            .then(m => m.STAKEHOLDER_ROUTES),
      },
    ],
  },

  // ❓ Fallback (ALWAYS LAST)
  {
    path: '**',
    redirectTo: '',
  },
];
