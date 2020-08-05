import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrNotificationService } from '../toastr-notification.model/toastr-notification.service';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

  constructor(private router: Router, private _notification: ToastrNotificationService, private us: UserService) {
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem(environment.STORE_KEY, Date.now().toString());
  }


  public getLastAction() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem(environment.STORE_KEY));
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(environment.STORE_KEY, lastAction.toString());
  }


  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, environment.CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + Number(environment.MINUTES_UNITL_AUTO_LOGOUT) * 10 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    if (isTimeout && localStorage.token) {
      localStorage.clear();
      this.router.navigate(['/login']);
      this._notification.showNotification(1, environment.sessionExpiryMessage);
      this.us.killAlltabs();
    }
  }
}
