import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent {

  constructor(
    private authservice: AuthService
  ) { }

  onLogout() {
    this.authservice.logout();
  }
}
