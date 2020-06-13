 // src/app/services/interceptor.service.ts
 import { Injectable } from '@angular/core';
 import {
 HttpInterceptor, HttpRequest,
 HttpHandler, HttpEvent, HttpErrorResponse
 } from '@angular/common/http';
 import { Observable, throwError, EMPTY } from 'rxjs';
 import { catchError } from 'rxjs/operators';
 @Injectable({
 providedIn: 'root'
 })
 export class InterceptorService implements HttpInterceptor{
  constructor() { }
  handleError(error: HttpErrorResponse){
   console.log(error.message);
   return EMPTY;
  }
 intercept(req: HttpRequest<any>, next: HttpHandler):
 Observable<HttpEvent<any>>{
  return next.handle(req)
  .pipe(
   catchError(this.handleError)
  )
  };
 }