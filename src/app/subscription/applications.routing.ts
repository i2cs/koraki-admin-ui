import { Routes } from '@angular/router';
import { SubscriptionMainComponent } from './subscription-main/subscription-main.component';

export const SubscriptionRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: '',
        component: SubscriptionMainComponent
    }]
}
];
