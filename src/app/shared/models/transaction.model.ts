export interface Transaction {
  id?: number;
  projectId: number;
  stageId: number;
  vendorId: number;
  date: string;
  entryType: 'Material' | 'Service';
  paymentMode: string;
  totalAmount: number;
  creditAmount: number;
  comments?: string;
  createdBy?: number;
  createdAt?: string;
}
