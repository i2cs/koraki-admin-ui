import { Routes } from '@angular/router';
import { FacebookComponent } from './facebook/facebook.component';
import { MainComponent } from './main/main.component';
import { MailchimpComponent } from './mailchimp/mailchimp.component';
import { PrivyComponent } from './privy/privy.component';

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
    }, {
        path: 'mailchimp/:id',
        component: MailchimpComponent
    }, {
        path: 'privy/:id',
        component: PrivyComponent
    }]
}
];
