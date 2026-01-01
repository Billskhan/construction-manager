export interface Project {
  id?: number;
  name: string;
  location?: string;
  status: 'Active' | 'Completed';
  startDate?: string;
  endDate?: string;
  createdBy?: number;
  createdAt?: string;
}
