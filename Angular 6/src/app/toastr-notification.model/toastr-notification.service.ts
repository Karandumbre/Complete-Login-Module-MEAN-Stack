import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Notification, NotificationType } from './toastr-notification.model';

@Injectable()
export class ToastrNotificationService {
  public subject = new Subject<Notification>();
  public keepAfterRouteChange = true;

  constructor(public router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert messages
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }



  // success(message: string, keepAfterRouteChange = false) {
  //   this.showNotification(NotificationType.Success, message, keepAfterRouteChange);
  // }

  // error(message: string, keepAfterRouteChange = false) {
  //   this.showNotification(NotificationType.Error, message, keepAfterRouteChange);
  // }

  // info(message: string, keepAfterRouteChange = false) {
  //   this.showNotification(NotificationType.Info, message, keepAfterRouteChange);
  // }

  // warn(message: string, keepAfterRouteChange = false) {
  //   this.showNotification(NotificationType.Warning, message, keepAfterRouteChange);
  // }
  /**
   * Shows notification
   * @param type : '0 = Success,1 = Error,2 = Info,3 = Warning'
   * @param message :'Your Custom Message'
   * @param [keepAfterRouteChange] :True is you want to display after route change
   */
  showNotification(type: number, message: string, keepAfterRouteChange = false) {
    let messagetype: NotificationType;
    switch (type) {
      case 0:
        messagetype = NotificationType.Success;
        break;
      case 1:
        messagetype = NotificationType.Error;
        break;
      case 2:
        messagetype = NotificationType.Info;
        break;
      case 3:
        messagetype = NotificationType.Warning;
        break;
    }
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<Notification>{ type: messagetype, message: message });
  }

  clear() {
    this.subject.next();
  }


}
