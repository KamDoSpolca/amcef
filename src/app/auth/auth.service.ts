import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string | null = null;
  private authStatusListener = new Subject<boolean>();
  private readonly BACKEND_URL = 'https://647e0baaaf984710854ad9a8.mockapi.io';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  public getToken() {
    return this.token;
  }

  public getIsAuth() {
    return this.isAuthenticated;
  }

  public getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  /////////////////
  // LOGIN is Mocked, because this is just FE dev demonstration application w/o backend
  /////////////////
  public login(email: string, password: string) {
    const url = `${this.BACKEND_URL}/api/auth`;
    const authData: any = { email: email, password: password };

    this.http.post<{ token: string }>(url, authData)
      .subscribe(res => {
        if (res.token) {
          this.token = res.token;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/dashboard']);
          this.snackBar.open('Logged In Successfully', 'CLOSE');
        }
      },
        error => {
          this.authStatusListener.next(false);          
        });
  }

  public logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.snackBar.open('Logged Out Successfully', 'CLOSE');

    this.router.navigate(['/']);
  }
}
