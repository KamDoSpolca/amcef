import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from './modal/confirm-modal.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private _matDialog: MatDialog
  ) { }


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {

        let errMessage = 'An error occured.';
        if (err.error.message) {
          errMessage = err.error.message;
        }
        this._matDialog.open(ConfirmModalComponent, {
          width: '450px',
          data: {
            title: errMessage,
            question: 'Unexpected error happends ',
            header: 'An Error Occured',
            cancel: null,
            confirm: 'OK',
            btnClass: 'button--neutral'
          }
        });

        return throwError(err);
      })
    );
  }
}
