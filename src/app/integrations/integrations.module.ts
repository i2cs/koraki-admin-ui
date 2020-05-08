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
import { WordpressComponent } from './wordpress/wordpress.component';
import { EventConfigViewComponent } from './event-config-view/event-config-view.component';
import { TextInputHighlightModule } from 'angular-text-input-highlight';
import { EventConfigNotificationPreviewComponent } from './event-config-notification-preview/event-config-notification-preview.component';
import { RuleConfigViewComponent } from './rule-config-view/rule-config-view.component';
import { KorakiwebapiComponent } from './korakiwebapi/korakiwebapi.component';
import { KorakiliveComponent } from './korakilive/korakilive.component';
import { WpContentRenderComponent } from 'app/shared/wp-content-render/wp-content-render.component';

@NgModule({
  imports: [
    RouterModule.forChild(IntegrationsRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentModule,
    TextInputHighlightModule
  ],
  declarations: [WpContentRenderComponent, FacebookComponent, MainComponent, MailchimpComponent, PrivyComponent, OpencartComponent, IntercomComponent, TwitterComponent, ZapierComponent, ShopifyComponent, WordpressComponent, EventConfigViewComponent, EventConfigNotificationPreviewComponent, RuleConfigViewComponent, KorakiwebapiComponent, KorakiliveComponent]
})
export class IntegrationsModule { }
