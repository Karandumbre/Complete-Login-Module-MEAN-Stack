import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      this.userService.deleteToken();
      return false;
    } else {
      const Window = window.open('https://www.google.com', '_blank');
      this.userService.browserTabArray.push({ windowId: 'window' + this.userService.tabsOpen + 1, windowHandler: Window });
      this.userService.tabsOpen += 1;
      return true;
    }
  }
}
