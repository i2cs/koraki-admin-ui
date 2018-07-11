import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionMainComponent } from './subscription-main/subscription-main.component';
import { RouterModule } from '@angular/router';
import { SubscriptionRoutes } from './applications.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxStripeModule } from 'ngx-stripe';
import { MaterialModule } from '../app.module';
import { SubscriptionCreateComponent } from './subscription-create/subscription-create.component';

@NgModule({
  imports: [
    RouterModule.forChild(SubscriptionRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_JMl4h4YIUrGfy66IluaI5dJo'),
    CommonModule,
    MaterialModule
  ],
  declarations: [SubscriptionMainComponent, SubscriptionMainComponent, SubscriptionCreateComponent]
})
export class SubscriptionModule { }
