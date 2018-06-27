import { Routes } from '@angular/router';
import { FacebookComponent } from './facebook/facebook.component';
import { MainComponent } from './main/main.component';

export const IntegrationsRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: '',
        component: MainComponent
    }, {
        path: 'facebook',
        component: FacebookComponent
    }, {
        path: 'facebook/:id',
        component: FacebookComponent
    }]
}
];
