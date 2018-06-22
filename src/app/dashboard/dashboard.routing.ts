import { Routes } from '@angular/router';

import { DashboardComponent } from './main/dashboard.component';

export const DashboardRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'dashboard',
        component: DashboardComponent
    }]
}
];
