import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../app.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticateRoute } from './authenticate.routing';
//import { CallbackComponent } from './callback/callback.component';

@NgModule({
  imports: [
    RouterModule.forChild(AuthenticateRoute),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [LoginComponent /*, CallbackComponent*/]
})
export class AuthenticateModule { }
