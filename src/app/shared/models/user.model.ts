export type UserRole = 'MANAGER' | 'VENDOR';

export interface User {
  id: number;
  name: string;
  phone: string;
  role: UserRole;
}
