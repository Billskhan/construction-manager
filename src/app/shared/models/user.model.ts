export type UserRole = 'MANAGER' | 'VENDOR' | 'STAKEHOLDER';
export interface User {
  id: number;
  name: string;
   phone: string;
   role: UserRole;
  //role: 'MANAGER' | 'VENDOR' | 'STAKEHOLDER';

  // Only present if role === 'VENDOR'
  vendorId?: number;
  
}
