import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionMainComponent } from './subscription-main/subscription-main.component';
import { RouterModule } from '@angular/router';
import { SubscriptionRoutes } from './applications.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxStripeModule } from 'ngx-stripe';
import { MaterialModule } from '../app.module';
import { SubscriptionCreateComponent } from './subscription-create/subscription-create.component';
import { InvoiceTableComponent } from './invoice-table/invoice-table.component';
import { MomentModule } from 'ngx-moment';
import { environment } from 'environments/environment.prod';

@NgModule({
  imports: [
    RouterModule.forChild(SubscriptionRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(environment.stripePublicKey),
    CommonModule,
    MaterialModule,
    MomentModule
  ],
  declarations: [SubscriptionMainComponent, SubscriptionMainComponent, SubscriptionCreateComponent, InvoiceTableComponent]
})
export class SubscriptionModule { }
