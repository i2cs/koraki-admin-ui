import { Routes } from '@angular/router';
import { SubscriptionMainComponent } from './subscription-main/subscription-main.component';
import { SubscriptionCreateComponent } from './subscription-create/subscription-create.component';

export const SubscriptionRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: '',
        component: SubscriptionMainComponent
    }, {
        path: 'add',
        component: SubscriptionCreateComponent
    }]
}
];
