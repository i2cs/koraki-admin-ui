import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
 
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { ErrorService } from '../services/error.service';
import { LoadingServiceService } from '../services/loading-service.service';
 
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
 
  constructor(
      private error: ErrorService,
      private loadingService: LoadingServiceService
  ) {}
 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.loading(true);

    return next.handle(request).do((event: HttpEvent<any>) => {
        if(event instanceof HttpResponse){
            this.loadingService.loading(false);
        }
    }, (e: any) => {
      this.loadingService.loading(false);
      if (e instanceof HttpErrorResponse) {
        this.error.handle(e);
      }
    });
  }
}