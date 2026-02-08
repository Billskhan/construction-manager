export interface Transaction {
  id?: number;
  projectId: number;
  stageId: number;
  vendorId: number;
  date: string;
  entryType: string;
  paymentMode: string;
  totalAmount: number;
  creditAmount: number;
  comments?: string;
  createdBy?: number;

  // STEP 20 — Acknowledgement status
  ackStatus?: 'PENDING' | 'CONFIRMED' | 'REJECTED';
}

