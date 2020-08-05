import { Component, OnInit } from '@angular/core';
import { Notification, NotificationType } from '../toastr-notification.model';
import { ToastrNotificationService } from '../toastr-notification.service';
@Component({
  selector: 'app-toastr-notification',
  templateUrl: './toastr-notification.component.html',
  styleUrls: ['./toastr-notification.component.css']
})

export class ToastrNotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(public _notificationService: ToastrNotificationService) {
  }

  ngOnInit() {
    this._notificationService.getAlert().subscribe((alert: Notification) => {
      this.notifications = [];
      if (!alert) {
        this.notifications = [];
        return;
      }
      this.notifications.push(alert);
      setTimeout(() => {
        this.notifications = this.notifications.filter(x => x !== alert);
      }, 4000);
    });
  }

  removeNotification(notification: Notification) {
    this.notifications = this.notifications.filter(x => x !== notification);
  }

  /**Set css class for Alert -- Called from alert component**/
  cssClass(notification: Notification) {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case NotificationType.Success:
        return 'toast-success';
      case NotificationType.Error:
        return 'toast-error';
      case NotificationType.Info:
        return 'toast-info';
      case NotificationType.Warning:
        return 'toast-warning';
    }
  }
}
