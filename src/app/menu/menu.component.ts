import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html'  
})
export class MenuComponent implements OnInit, OnDestroy {

  public userIsAuth = false;

  private destroyObservable$ = new Subject();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  
    this.userIsAuth = this.authService.getIsAuth();

    this.authService.getAuthStatusListener()
      .pipe(takeUntil(this.destroyObservable$))
      .subscribe(isAuthenticated => {
        this.userIsAuth = isAuthenticated;      
      });
  }

  ngOnDestroy() {
    this.destroyObservable$.next(true);
    this.destroyObservable$.complete();
  }
}
