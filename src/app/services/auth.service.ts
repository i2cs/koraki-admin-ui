
import { Injectable } from '@angular/core';
import { Configuration, ConfigurationParameters, SubscriptionsDataViewModel, SubscriptionsService } from 'koraki-angular-client';
import { environment } from 'environments/environment';
import { LocalStorageService } from 'angular-web-storage';
import * as auth0 from 'auth0-js';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

(window as any).global = window;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userProfile: any;
  auth0 = new auth0.WebAuth({
    clientID: environment.auth.clientID,
    domain: environment.auth.domain,
    responseType: 'token id_token',
    audience: environment.auth.audience,
    redirectUri: environment.auth.redirect,
    scope: environment.auth.scope
  });
  

  constructor(
    private local: LocalStorageService,
    private router: Router
  ) {}

  private getAccessToken(): string {
    if (this.local.get("access-token")) {
      return this.local.get("access-token");
    }
  }

  public login() {
    this.auth0.authorize();
  }

  public setAccessToken(token: string) {
    this.local.set("access-token", token);
  }

  public unsetAccessToken() {
    this.local.remove("access-token");
  }

  public getAuthConfig(): Configuration {
    return new Configuration(
      <ConfigurationParameters>{
        apiKeys: { "Authorization": "Bearer " + this.getAccessToken() },
        basePath: environment.apiBaseUrl,
        withCredentials: true,
      }
    );
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.router.navigate(['/dashboard']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    this.setAccessToken(authResult.idToken);
  }

  public logout(): void {
    this.unsetAccessToken();

    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    //todo: implement jwt parse
    return this.local.get("access-token");
  }
}
