import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback/callback.component';

export const AuthenticateRoute: Routes = [
    {
        path: '',
        children: [{
            path: 'login',
            component: LoginComponent
        }]
    }
];
