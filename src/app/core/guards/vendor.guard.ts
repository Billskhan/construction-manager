import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const vendorGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.user()?.role;

  // Allow vendor OR manager
  if (role === 'VENDOR' || role === 'MANAGER') {
    return true;
  }

  router.navigateByUrl('/');
  return false;
};
