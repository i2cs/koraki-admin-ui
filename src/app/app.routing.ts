import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuardService as AuthGurad } from './services/auth-gurads.service';
import { NoAuthGuardService as NoAuthGurad } from './services/auth-gurads.service';
import { CallbackComponent } from './authenticate/callback/callback.component';
import { IntegrationsModule } from './integrations/integrations.module';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGurad],
    children: [{
      path: '',
      loadChildren: './dashboard/dashboard.module#DashboardModule'
    }, {
      path: 'applications',
      loadChildren: './applications/applications.module#ApplicationsModule'
    }, {
      path: 'integrations',
      loadChildren: './integrations/integrations.module#IntegrationsModule'
    }, {
      path: 'subscription',
      loadChildren: './subscription/subscription.module#SubscriptionModule'
    }
    ]
  }, {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [NoAuthGurad],
    children: [{
      path: '',
      loadChildren: './authenticate/authenticate.module#AuthenticateModule'
    }
    ]
  }, {
    path: 'auth/callback',
    canActivate: [NoAuthGurad],
    component: CallbackComponent
  }
];
