import { Injectable } from '@angular/core';
import { AcknowledgementService } from './acknowledgement.service';
import { NotificationStore } from '../notifications/notification.store';

@Injectable({ providedIn: 'root' })
export class AcknowledgementStore {

  constructor(
    private ackService: AcknowledgementService,
    private notificationStore: NotificationStore
  ) {}

  async confirm(transactionId: number, userId: number) {
    await this.ackService.confirm(transactionId);

    // refresh notifications after confirm
    await this.notificationStore.load(userId);
  }
}
