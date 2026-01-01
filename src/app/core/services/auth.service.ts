import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user = signal<User | null>(null);

  user = this._user.asReadonly();

  isLoggedIn = computed(() => !!this._user());

  isManager = computed(() => this._user()?.role === 'MANAGER');

  isVendor = computed(() => this._user()?.role === 'VENDOR');

  login(user: User) {
    this._user.set(user);
    localStorage.setItem('session_user', JSON.stringify(user));
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('session_user');
  }

  restoreSession() {
    const saved = localStorage.getItem('session_user');
    if (saved) {
      this._user.set(JSON.parse(saved));
    }
  }
}

