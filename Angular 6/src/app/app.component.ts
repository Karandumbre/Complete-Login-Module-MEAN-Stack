import { Component } from '@angular/core';
import { AutoLogoutService } from './shared/auto-logout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private autoLogout: AutoLogoutService) {

  }
  title = 'app';
}
