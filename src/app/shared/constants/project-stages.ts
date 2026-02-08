export interface ProjectStage {
  id: number;
  name: string;
}

export const PROJECT_STAGES: ProjectStage[] = [
  { id: 1, name: 'Pre-Construction' },
  { id: 2, name: 'Foundation + DPC' },
  { id: 3, name: 'Lintel Beam' },
  { id: 4, name: 'Roof Slab' },
  { id: 5, name: '1st Floor' },
  { id: 6, name: '2nd Floor' },
  { id: 7, name: 'Mumty' },
  { id: 8, name: 'Boundary Wall' },
  { id: 9, name: 'Plastering' },
  { id: 10, name: 'Finishing' },
];
