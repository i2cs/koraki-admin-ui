import { Routes } from '@angular/router';
import { SubscriptionMainComponent } from './subscription-main/subscription-main.component';
import { SubscriptionCreateComponent } from './subscription-create/subscription-create.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { CreatePaymentMethodComponent } from './create-payment-method/create-payment-method.component';

export const SubscriptionRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'plans',
        component: SubscriptionMainComponent
    }, {
        path: 'add',
        component: SubscriptionCreateComponent
    }, {
        path: 'cards',
        component: PaymentMethodsComponent
    }, {
        path: 'cards/add',
        component: CreatePaymentMethodComponent
    }, {
        path: 'invoices',
        component: InvoicesComponent
    }]
}
];
