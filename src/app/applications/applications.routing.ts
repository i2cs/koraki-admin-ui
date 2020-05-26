import { Routes } from '@angular/router';

import { ApplicationsComponent } from './main/applications.component';
import { NewApplicationComponent } from './new-application/new-application.component';
import { ViewApplicationComponent } from './view-application/view-application.component';

export const ApplicationsRoutes: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: ApplicationsComponent
        }, {
            path: 'new',
            component: NewApplicationComponent
        }, {
            path: 'view/:id',
            component: ViewApplicationComponent
        }, {
            path: 'view/:id/:page',
            component: ViewApplicationComponent
        }, {
            path: 'view/:id/:page/:integration',
            component: ViewApplicationComponent
            //loadChildren: '../integrations/integrations.module#IntegrationsModule'
        }]
    }
];
