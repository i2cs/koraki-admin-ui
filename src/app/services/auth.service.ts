
import { Injectable } from '@angular/core';
import { Configuration, ConfigurationParameters, SubscriptionsDataViewModel, SubscriptionsService } from 'koraki-angular-client';
import { environment } from 'environments/environment';
import { LocalStorageService } from 'angular-web-storage';
import * as auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

(window as any).global = window;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userProfile: any;
  auth0Options: any;
  lock: Auth0Lock;

  constructor(
    private local: LocalStorageService,
    private router: Router
  ) { 
    this.auth0Options = {
      theme: {
        logo: '/assets/img/koraki-logo.png',
        primaryColor: '#f2a133'
      },
      auth: {
        redirectUrl: environment.auth.redirect,
        responseType: 'token id_token',
        audience: environment.auth.audience,
        params: {
          scope: environment.auth.scope
        }
      },
      container: 'hiw-login-container',
      autoclose: true,
      languageDictionary: {
        title: "",
        signUpTerms: "I agree with Koraki.io T&C"
      },
      mustAcceptTerms: true
    };
  }

  private getAccessToken(): string {
    if (this.local.get("access-token")) {
      return this.local.get("access-token");
    }
  }

  public login() {
    let email = this.getParameterByName('email');
    if(!email){
      email = this.local.get("email_prefill");
    }
    if(email){
      this.auth0Options.prefill = {
        email: email
      }
      this.local.remove("email_prefill");
    }
  
    this.lock = new Auth0Lock(
      environment.auth.clientID,
      environment.auth.domain,
      this.auth0Options
    );

    this.lock.on('authenticated', (authResult: any) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        var redirect = this.local.get("redirect");
        if (redirect) {
          this.local.remove("redirect");
          window.location.href = redirect;
        } else {
          this.router.navigate(['/dashboard']);
        }
      }
    });

    this.lock.logout

    this.lock.on('authorization_error', error => {
      this.router.navigate(['/']);
        console.log(error);
    });

    this.lock.show();
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
    // depricated
  }

  private setSession(authResult): void {
    this.setAccessToken(authResult.idToken);
  }

  public logout(): void {
    this.unsetAccessToken();

    this.lock = new Auth0Lock(
      environment.auth.clientID,
      environment.auth.domain,
      this.auth0Options
    );

    this.lock.logout({
      returnTo: environment.baseUrl
    });

    // Go back to the home route
    //this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    //todo: implement jwt parse
    return this.local.get("access-token");
  }

  getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
