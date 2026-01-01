import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  // ✅ User is logged in
  if (auth.user()) {
    return true;
  }

  // ❌ Not logged in → redirect to login
  router.navigateByUrl('/login');
  return false;
};
