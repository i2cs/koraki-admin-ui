import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'angular-web-storage';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthService, 
    private local: LocalStorageService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  canActivate(): boolean {
    debugger;
    if (!this.auth.isAuthenticated() && window.location.href.indexOf("integrations/shopify") === -1) {
      this.local.set("redirect", window.location.href);
      let email = this.getParameterByName('email');
      if(email){
        this.local.set('email_prefill', email);
      }
      
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}

@Injectable()
export class NoAuthGuardService implements CanActivate {

  constructor(
    public auth: AuthService, 
    public router: Router
  ) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}