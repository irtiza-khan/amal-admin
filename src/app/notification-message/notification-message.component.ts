import { Component, OnInit } from '@angular/core';
import { NotifyService } from 'app/core/notify.service';

@Component({
  selector: 'notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.scss']
})
export class NotificationMessageComponent {

  iconClass = {
    'error': 'error_outline',
    'info': 'add_alert',
    'warning': 'warning',
    'success': 'check'

  }

  constructor(public notify: NotifyService) { }
}
