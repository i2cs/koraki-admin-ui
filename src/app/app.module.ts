import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AppRoutes } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { Configuration, ConfigurationParameters, ApiModule } from 'koraki-angular-client';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: []
})
export class MaterialModule {}

export function apiConfigFactory (): Configuration {
  const params: ConfigurationParameters = {
    // set configuration parameters here.
    apiKeys : {"Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFUVTVNVVV6TURKQ05UZzRSRGMzT1VKRlFVRkdPRFpFUVRnM09VTTFNVEF5TmtGQk1EZzVRZyJ9.eyJlbWFpbCI6InNhc3NyaS51Y3NjQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9rb3Jha2kuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViMTgxODQ0YTc2YjcwMjE2OTI0OWVmNSIsImF1ZCI6ImduMHNGM3ZnOHppQVdOUzNFemRISVlSMjZ4NTU2NFZuIiwiaWF0IjoxNTI4NjM2Mjc3LCJleHAiOjE1Mjk1MDAyNzcsImF0X2hhc2giOiJmeWJ4N1VWYURrM0ZnQUdKaVlwMHlRIiwibm9uY2UiOiJaTng0Ry16QUdrREZFYzFDdGFjd3J3ODlDS2N5OE5tWiJ9.Ow92bpHJkmxkyBbC-It9gsXvSVKvNbUMP_FQR56Gnhe3241z5rlXmtyGiUCEBAALE1UyeIshir1posRG_KFFtjEmDKWhKrzmxlm33JqOvqW6eh-2JoC_DEB6-kGvoxbYg5rWKGXEVyZbeiOACFvyVXKh_Y3seqnvLH9ZTqKMjbtz_wT5e8TLBXOjFMv1ZD5vHK5xFGO5zUyaKdpUzzvXl6cYLRhGNH6RM4x2n1CfQRJqW3T3FbKM3WYHMTmvfUswHaY2oelFo1Vn65Dq80i3Y0-uhhVm6jnfuQ36V29t0UTttMUiXu3VPOxiv2Vzfx8r_iiR1ZF2rytWfJQZ-mPNeg"},
    withCredentials : true,
    basePath : "http://localhost:5000"
  }
  return new Configuration(params);
}

@NgModule({
    imports:      [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        HttpModule,
        MaterialModule,
        MatNativeDateModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        HttpClientModule,
        ApiModule.forRoot(apiConfigFactory)
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent
    ],
    //providers: [{ provide: BASE_PATH, useValue: "http://localhost:5000" }],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
