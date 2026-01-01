import { Component, OnInit } from '@angular/core';
import { NotificationStore } from './notification.store';
import { AuthService } from '../../core/services/auth.service';
import { AcknowledgementStore } from '../acknowledgements/acknowledgement.store';

@Component({
  standalone: true,
  selector: 'app-notifications',
  template: `
    <h2>Notifications</h2>

    @if (store.notifications().length === 0) {
      <p>No notifications</p>
    }

    @for (n of store.notifications(); track n.id) {
      <div [style.opacity]="n.isRead ? 0.6 : 1">
        <h4>{{ n.title }}</h4>
        <p>{{ n.message }}</p>

        @if (!n.isRead) {
          <button (click)="confirm(n)">Confirm Received</button>
        }
      </div>
    }
  `,
})
export class NotificationListComponent implements OnInit {

  constructor(
    public store: NotificationStore,
    private ackStore: AcknowledgementStore,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.store.load(this.auth.user()!.id);
  }

  confirm(notification: any) {
    // mark ack confirmed
    // update acknowledgement table (next step)
    this.store.markRead(notification);
      this.ackStore.confirm(
    notification.transactionId,
    this.auth.user()!.id
  );
  }
}
