export interface Project {
  id?: number;
  name: string;
  location?: string;
  status: 'Active' | 'Completed';
  startDate?: string;
  endDate?: string;
    description?: string;
  projectManager?: string;
  plotSize?: string;
  cashAmount?: number;
  financedAmount?: number;
  createdBy?: number;
  createdAt?: string;
}
