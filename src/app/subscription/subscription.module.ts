import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionMainComponent } from './subscription-main/subscription-main.component';
import { RouterModule } from '@angular/router';
import { SubscriptionRoutes } from './applications.routing';

@NgModule({
  imports: [
    RouterModule.forChild(SubscriptionRoutes),
    CommonModule
  ],
  declarations: [SubscriptionMainComponent, SubscriptionMainComponent]
})
export class SubscriptionModule { }
