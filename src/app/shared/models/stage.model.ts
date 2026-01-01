export interface Stage {
  id?: number;
  projectId: number;
  name: string;
  sequence: number;
  budget?: number;
  isActive: boolean;
}
