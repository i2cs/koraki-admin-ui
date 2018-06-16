
import { Injectable } from '@angular/core';
import { Configuration, ConfigurationParameters } from 'koraki-angular-client';
import { environment } from 'environments/environment';
import { LocalStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public local: LocalStorageService) { }

  private getAccessToken(): string {
    if (this.local.get("access-token")) {
      return this.local.get("access-token");
    }
  }

  //eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFUVTVNVVV6TURKQ05UZzRSRGMzT1VKRlFVRkdPRFpFUVRnM09VTTFNVEF5TmtGQk1EZzVRZyJ9.eyJlbWFpbCI6InNhc3NyaS51Y3NjQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9rb3Jha2kuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViMTgxODQ0YTc2YjcwMjE2OTI0OWVmNSIsImF1ZCI6ImduMHNGM3ZnOHppQVdOUzNFemRISVlSMjZ4NTU2NFZuIiwiaWF0IjoxNTI4NjM2Mjc3LCJleHAiOjE1Mjk1MDAyNzcsImF0X2hhc2giOiJmeWJ4N1VWYURrM0ZnQUdKaVlwMHlRIiwibm9uY2UiOiJaTng0Ry16QUdrREZFYzFDdGFjd3J3ODlDS2N5OE5tWiJ9.Ow92bpHJkmxkyBbC-It9gsXvSVKvNbUMP_FQR56Gnhe3241z5rlXmtyGiUCEBAALE1UyeIshir1posRG_KFFtjEmDKWhKrzmxlm33JqOvqW6eh-2JoC_DEB6-kGvoxbYg5rWKGXEVyZbeiOACFvyVXKh_Y3seqnvLH9ZTqKMjbtz_wT5e8TLBXOjFMv1ZD5vHK5xFGO5zUyaKdpUzzvXl6cYLRhGNH6RM4x2n1CfQRJqW3T3FbKM3WYHMTmvfUswHaY2oelFo1Vn65Dq80i3Y0-uhhVm6jnfuQ36V29t0UTttMUiXu3VPOxiv2Vzfx8r_iiR1ZF2rytWfJQZ-mPNeg
  public setAccessToken(token: string) {
    this.local.set("access-token", token);
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
}
