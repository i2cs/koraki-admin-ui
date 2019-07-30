import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private auth: AuthService
  ) { 
  }

  handle(error: any): any {
    if(error && error.status == 401 && window.location.href.indexOf("integrations/shopify") === -1){
      this.auth.logout();
    }
  }
}
