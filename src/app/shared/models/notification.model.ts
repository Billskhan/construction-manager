export interface AppNotification {
  id?: number;
  userId: number;
  transactionId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}
