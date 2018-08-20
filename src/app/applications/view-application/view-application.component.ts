import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService, ApplicationViewDataModel, ApplicationUpdateDataModel, ApplicationIntegrationViewModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { SubscriptionService } from '../../services/subscription.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

declare const $: any;

interface _Iterable extends Iterable<{}> {
  length: number;
}

class _Array<T> extends Array<T> {
  static range(from: number, to: number, step: number): number[] {
    return Array.from(
      (<_Iterable>{ length: Math.floor((to - from) / step) + 1 }),
      (v, k) => from + k * step
    );
  }
}

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss']
})

export class ViewApplicationComponent implements OnInit, AfterViewInit {
  @ViewChild('iframe') iframe: ElementRef;
  loading: boolean;
  hide: boolean;
  appId: string;
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};
  integrations: Map<string, ApplicationIntegrationViewModel> = new Map<string, ApplicationIntegrationViewModel>();
  script: string;
  status: boolean;
  mobile: boolean;
  updatingSettings: boolean;
  allIntegrations: any[] = Array();
  allowedIntegrations: any = {};
  allIntegrationsOriginal: any[] = Array();
  possibleCounts: number[] = _Array.range(8, 100, 1);
  possibleDays: number[] = _Array.range(1, 100, 1);
  filter: string;
  updated: { name: string } = { name : ""};
  nameEditing: boolean;
  paid: boolean = false;
  url: string;
  allowedSessionCount: number;
  sessions: number;

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private loadingService: LoadingServiceService,
    private router: Router,
    private notify: NotificationService,
    private data: MemoryDataHolderServiceService,
    private subscription: SubscriptionService,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(){
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.integrations = <Map<string, ApplicationIntegrationViewModel>>this.data.store.get("integrations_" + params['id']);
        if (!this.integrations) {
          this.integrations = new Map<string, ApplicationIntegrationViewModel>();
          this.appservice.getApplicationIntegrationsById(params['id']).subscribe(a => {
            for (var i in a) {
              this.integrations[a[i].code] = a[i];
            }

            this.data.store.set("integrations_" + params['id'], this.integrations);
          });
        }
      }
    });

    this.subscription.permissions().subscribe(a => {
      a.integrations.forEach(a => {
        this.allowedIntegrations[a.code] = true;
      });

      if (a.permissons["unique_sessions.maximum"]) {
        this.allowedSessionCount = Number.parseInt(a.permissons["unique_sessions.maximum"]);
        this.setProgress();
      }

      let number = Number.parseInt(a.permissons['notifications_active_per_app.maximum']);
      this.possibleCounts = _Array.range(1, Math.min(number, 100), 1);
      if(number > 100){
        this.possibleCounts.push(1000);
      }
      this.paid = a.permissons['paid'] === "true";
    });
  }

  ngOnInit() {
    this.breadcrumbService.show([
      {title: "Applications", url: "/applications"}
    ]);

    this.allIntegrations.push({
      code: "opencart",
      title: "OpenCart",
      description: "Module contains notification widget. This module can be installed from OpenCart admin panel",
      capable: "This integration can <b>Read</b> and <b>Write</b> notifications",
      buttonTitle: "Install",
      help: "https://koraki.io/how-to-add-koraki-to-opencart/",
      ecommerce: true
    });

    this.allIntegrations.push({
      code: "shopify",
      title: "Shopify",
      description: "Connect your Shopify store with Koraki. This provides Shopify customer interaction notifications and add Koraki widget on Shopify store",
      capable: "This integration can <b>Read</b> and <b>Write</b> notifications",
      buttonTitle: "Integrate",
      ecommerce: false
    });

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

    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    this.hide = true;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.appId = params['id'];
        this.appservice.getApplicationById(params['id']).subscribe(a => {
          this.application = a;
          this.url = environment.apiBaseUrl + "/widget.html?_i=" + a.clientId;
          this.iframe.nativeElement["src"] = this.url;
          this.status = a.status == "Active";
          this.script = "<script>window.sparkleSettings = { app_id: \"" + a.clientId + "\" }; !function(){function t(){var t=a.createElement(\"script\"); t.type=\"text/javascript\", t.async=!0,t.src=\"\/\/api.koraki.io//widget/v1.0/js\"; var e=a.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(t,e)} var e=window,a=document;e.attachEvent?e.attachEvent(\"onload\",t):e.addEventListener(\"load\",t,!1)}();</script>"
          this.breadcrumbService.show([
            {title: "Applications", url: "/applications"},
            {title: a.applicationName, url: "/applications/view/" + a.id}
          ]);

          this.setProgress();
        });

        this.route.fragment.subscribe(query => {
          if (query && this.getFragmentParameter(query, "new")) {
            this.notify.success("Application created!");
            
            //clear hash
            window.location.hash = '';
          }
        });
      }
    });
  }

  setProgress(){
    if(this.application.uniqueVisitors && this.allowedSessionCount){
      this.sessions = Number((this.application.uniqueVisitors / this.allowedSessionCount) * 100);
      if(this.sessions > 100){
        this.sessions = 100;
      }
    }
  }

  refreshPreview(){
    this.iframe.nativeElement["src"] = this.url;
  }

  filterList() {
    var text = this.filter.toLowerCase();
    this.allIntegrations = this.allIntegrationsOriginal.filter(a => a['title'].toLowerCase().indexOf(text) !== -1);
  }

  updateApplicationStatus() {
    let status: ApplicationUpdateDataModel.StatusEnum = this.status ? ApplicationUpdateDataModel.StatusEnum.Active : ApplicationUpdateDataModel.StatusEnum.Disabled;
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{ status: status }).subscribe(a => {
      this.application = a;
      this.notify.success("Application is " + status.toString());
    }, e => {
      this.application.status = status == ApplicationUpdateDataModel.StatusEnum.Active ? 
        ApplicationUpdateDataModel.StatusEnum.Disabled : ApplicationUpdateDataModel.StatusEnum.Active;
      this.status = this.application.status == ApplicationUpdateDataModel.StatusEnum.Active;
      this.notify.error(e.error.message);
    });
  }

  updateApplicationSettings() {
    this.updatingSettings = true;
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{
      notificationMaximumActiveCount: this.application.notificationMaximumActiveCount,
      notificationMaximumDurationDays: this.application.notificationMaximumDurationDays
    }).subscribe(a => {
      this.updatingSettings = false;
      this.application = a;
      this.notify.success("Application settings saved");
    }, e => {
      this.updatingSettings = false;
    });
  }

  deleteApplication() {
    var result = confirm("Are you sure you want to delete this application? This action is not reversible");
    if (result) {
      this.appservice.deleteApplication(this.application.id).subscribe(a => {
        this.notify.success("Application deleted!");
        this.router.navigate(['/applications']);
      });
    }
  }

  updateName(){
    this.updatingSettings = true;
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{
      applicationName: this.updated.name
    }).subscribe(a => {
      this.updatingSettings = false;
      this.application = a;
      this.nameEditing = false;
      this.notify.success("Application name updated");
    }, e => {
      this.updatingSettings = false;
      this.nameEditing = false;
      this.notify.error("Could not update the application name");
    });
  }

  sanitize(url: string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  trackByFn(index, item) {
    return item;
  }

  private getFragmentParameter(fragment: string, param: string) {
    var parts = fragment.split("&");
    if (parts.length > 0) {
      var access_token_parts = parts.filter(a => a.indexOf(param + "=") !== -1);
      if (access_token_parts.length > 0) {
        return access_token_parts[0].replace(param + "=", "");
      }
    }
  }
}
