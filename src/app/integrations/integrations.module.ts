import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookComponent } from './facebook/facebook.component';
import { RouterModule } from '@angular/router';
import { IntegrationsRoutes } from './integrations.routing';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MailchimpComponent } from './mailchimp/mailchimp.component';
import { PrivyComponent } from './privy/privy.component';
import { OpencartComponent } from './opencart/opencart.component';
import { IntercomComponent } from './intercom/intercom.component';
import { TwitterComponent } from './twitter/twitter.component';
import { MomentModule } from 'ngx-moment';
import { ZapierComponent } from './zapier/zapier.component';
import { ShopifyComponent } from './shopify/shopify.component';

@NgModule({
  imports: [
    RouterModule.forChild(IntegrationsRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentModule
  ],
  declarations: [FacebookComponent, MainComponent, MailchimpComponent, PrivyComponent, OpencartComponent, IntercomComponent, TwitterComponent, ZapierComponent, ShopifyComponent]
})
export class IntegrationsModule { }
