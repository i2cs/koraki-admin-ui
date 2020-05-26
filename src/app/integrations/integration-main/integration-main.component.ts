import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Input } from '@angular/core';
import { MailchimpComponent } from '../mailchimp/mailchimp.component';
import { ApplicationIntegrationViewModel, ApplicationsService, SubscriptionsDataViewModel } from 'koraki-angular-client';
import { AuthService } from 'app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SubscriptionService } from 'app/services/subscription.service';
import { NotificationService } from 'app/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MemoryDataHolderServiceService } from 'app/services/memory-data-holder-service.service';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { LoadingServiceService } from 'app/services/loading-service.service';
import { Observable } from 'rxjs';
import { KorakiliveComponent } from '../korakilive/korakilive.component';
import { KorakirecommendationComponent } from '../korakirecommendation/korakirecommendation.component';
import { WordpressComponent } from '../wordpress/wordpress.component';
import { PrivyComponent } from '../privy/privy.component';
import { OpencartComponent } from '../opencart/opencart.component';
import { IntercomComponent } from '../intercom/intercom.component';
import { TwitterComponent } from '../twitter/twitter.component';
import { ZapierComponent } from '../zapier/zapier.component';
import { FacebookComponent } from '../facebook/facebook.component';

@Component({
  selector: 'app-integration-main',
  templateUrl: './integration-main.component.html',
  styleUrls: ['./integration-main.component.scss']
})
export class IntegrationMainComponent implements OnInit {

  @ViewChild('target', { read: ViewContainerRef }) vcRef: ViewContainerRef;
  componentRef: ComponentRef<any>;
  allIntegrations: any[] = Array();
  allIntegrationsOriginal: any[];
  filter: string;
  integrations: Map<string, ApplicationIntegrationViewModel> = new Map<string, ApplicationIntegrationViewModel>();
  allowedIntegrations: any = {};
  @Input() permissions: Observable<SubscriptionsDataViewModel>;
  @Input() id: number;
  @Input() integration: Observable<string>;
  componentLoaded: boolean;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private loadingService: LoadingServiceService,
    private router: Router,
    private notify: NotificationService,
    private data: MemoryDataHolderServiceService,
    private subscription: SubscriptionService,
    private sanitizer: DomSanitizer,
    private auth: AuthService
    ) { }

  ngOnInit() {

    this.integration.subscribe(a => {
      let map = {
        "korakilive": KorakiliveComponent,
        "korakirecommendation": KorakirecommendationComponent,
        "wordpress": WordpressComponent,
        "facebook": FacebookComponent,
        "mailchimp": MailchimpComponent,
        "privy": PrivyComponent,
        "opencart": OpencartComponent,
        "intercom": IntercomComponent,
        "twitter": TwitterComponent,
        "zapier": ZapierComponent
      };

      let component = map[a];
      this.componentLoaded = Boolean(component);

      this.vcRef.clear();
      if(this.componentLoaded){
        const factory = this.resolver.resolveComponentFactory(component);
        this.componentRef = this.vcRef.createComponent(factory);
      }else if(a){
        window.location.href = "/applications/view/" + this.id + "/integrations";
        return;
      }
      
    });

    

    // this.allIntegrations.push({
    //   code: "korakiwebapi",
    //   title: "Koraki REST API",
    //   description: "Koraki REST API is available to integrate Koraki notifications with any custom app",
    //   capable: "This integration can <b>Read</b> and <b>Write</b> notifications",
    //   buttonTitle: "Integrate",
    //   help: "https://docs.koraki.io/project/api",
    //   ecommerce: false
    // });

    this.allIntegrations.push({
      code: "wordpress",
      title: "WP/WooCommerce",
      description: "Connect your Wordpress site or WooCommerce shop with Koraki",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Install",
      //help: "https://koraki.io/zapier-koraki-to-enable-more-than-1000-integrations/",
      ecommerce: true
    });

    this.allIntegrations.push({
      code: "korakilive",
      title: "Koraki Live",
      description: "Koraki Live is an intellegent automatic notification creator based on your site traffic",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Manage",
      //help: "https://docs.koraki.io/project/api",
      autoactive: true,
      ecommerce: false
    });

    this.allIntegrations.push({
      code: "korakirecommendation",
      title: "Koraki Recommendation",
      description: "Koraki Recommendation is an AI based notification generator",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Manage",
      //help: "https://docs.koraki.io/project/api",
      autoactive: true,
      ecommerce: false
    });

    this.allIntegrations.push({
      code: "opencart",
      title: "OpenCart",
      description: "Module contains notification widget. This module can be installed from OpenCart admin panel",
      capable: "This integration can <b>Read</b> and <b>Write</b> notifications",
      buttonTitle: "Install",
      help: "https://koraki.io/how-to-add-koraki-to-opencart/",
      ecommerce: true
    });

    // this.allIntegrations.push({
    //   code: "shopify",
    //   title: "Shopify",
    //   description: "Connect your Shopify store with Koraki. This provides Shopify customer interaction notifications and add Koraki widget on Shopify store",
    //   capable: "This integration can <b>Read</b> and <b>Write</b> notifications",
    //   buttonTitle: "Integrate",
    //   ecommerce: false
    // });

    this.allIntegrations.push({
      code: "facebook",
      title: "Facebook Page",
      description: "You can connect your Facebook fanpage to generate notifications on user comments, user posts on wall and new user review events.",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Integrate",
      ecommerce: false
    });

    this.allIntegrations.push({
      code: "twitter",
      title: "Twitter",
      description: "Twitter integration generates notifications hourly indicating how many new followers were added to the provided Twitter account.",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Integrate",
      ecommerce: false
    });

    this.allIntegrations.push({
      code: "intercom",
      title: "Intercom",
      description: "Connect your Intercom account with Koraki and show social notifications about your leads and users.",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Integrate",
      ecommerce: false
    });

    this.allIntegrations.push({
      code: "mailchimp",
      title: "MailChimp",
      description: "This integration can generate notifications when subscriber is added to email lists.",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Integrate",
      ecommerce: false
    });

    this.allIntegrations.push({
      code: "zapier",
      title: "Zapier",
      description: "Integrate Koraki with more than 1000 apps! You can use Zap editor to create new notifications.",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Integrate",
      help: "https://koraki.io/zapier-koraki-to-enable-more-than-1000-integrations/",
      ecommerce: false
    });

    this.allIntegrations.push({
      code: "privy",
      title: "Privy",
      description: "Generate notifications when someone subscribe for a campaign on Privy.",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Integrate",
      ecommerce: false
    });

    this.allIntegrationsOriginal = this.allIntegrations;
    this.permissions.subscribe(b => {

      if (this.id && this.auth.isAuthenticated()) {
        this.integrations = <Map<string, ApplicationIntegrationViewModel>>this.data.store.get("integrations_" + this.id);
        if (!this.integrations) {
          this.integrations = new Map<string, ApplicationIntegrationViewModel>();
          this.appservice.getApplicationIntegrationsById(this.id).subscribe(a => {
            for (var i in a) {
              this.integrations[a[i].code] = a[i];
            }
  
            this.data.store.set("integrations_" + this.id, this.integrations);
          });
        }
      }

      b.integrations.forEach(a => {
        this.allowedIntegrations[a.code] = true;
      });
    })

  }

  filterList() {
    var text = this.filter.toLowerCase();
    this.allIntegrations = this.allIntegrationsOriginal.filter(a => a['title'].toLowerCase().indexOf(text) !== -1);
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  trackByFn(index, item) {
    return item;
  }

  backToIntegrations() {
    this.router.navigate(["applications/view/" + this.id + "/integrations"]);
  }
}
