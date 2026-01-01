export interface TransactionItem {
  id?: number;
  transactionId?: number;
  category: string;
  subCategory: string;
  itemName: string;
  quantity: number;
  unit: string;
  length?: number;
  rate: number;
  carriage?: number;
  amount: number;
}
