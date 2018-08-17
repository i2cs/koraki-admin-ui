import { Routes } from '@angular/router';
import { FacebookComponent } from './facebook/facebook.component';
import { MainComponent } from './main/main.component';
import { MailchimpComponent } from './mailchimp/mailchimp.component';
import { PrivyComponent } from './privy/privy.component';
import { OpencartComponent } from './opencart/opencart.component';
import { IntercomComponent } from './intercom/intercom.component';
import { TwitterComponent } from './twitter/twitter.component';
import { ZapierComponent } from './zapier/zapier.component';
import { ShopifyComponent } from './shopify/shopify.component';

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
        path: 'mailchimp',
        component: MailchimpComponent
    }, {
        path: 'privy',
        component: PrivyComponent
    }, {
        path: 'opencart',
        component: OpencartComponent
    }, {
        path: 'intercom',
        component: IntercomComponent
    }, {
        path: 'twitter',
        component: TwitterComponent
    }, {
        path: 'zapier',
        component: ZapierComponent
    }, {
        path: 'shopify',
        component: ShopifyComponent
    }]
}
];
