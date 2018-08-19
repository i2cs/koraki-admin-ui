import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'angular-web-storage';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthService, 
    private local: LocalStorageService,
    public router: Router
  ) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.local.set("redirect", window.location.href);
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