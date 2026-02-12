import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const managerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
console.log('Current user:', auth.user());
console.log('isManager():', auth.isManager());
  if (auth.isManager()) return true;

  router.navigateByUrl('/dashboard');
  return false;
};

