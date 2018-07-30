import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ApplicationsService, MailChimpService, ApplicationViewDataModel, MailChimpSubscriptionDataCreateModel, ApplicationIntegrationViewModel } from 'koraki-angular-client';
import { NotificationService } from '../../services/notification.service';
import { LoadingServiceService } from '../../services/loading-service.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-mailchimp',
  templateUrl: './mailchimp.component.html',
  styleUrls: ['./mailchimp.component.scss']
})
export class MailchimpComponent implements OnInit {
  mcUrl: string = "https://login.mailchimp.com/oauth2/authorize";
  mcApiUrl: string = "/3.0/lists?count=100";
  mcDataCenter: string;
  accessToken: string;
  appId: string;
  mcLoggedIn: boolean;
  list: any;
  lists: any[];
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};
  status: boolean;
  loading: boolean;
  integrations: Map<string, ApplicationIntegrationViewModel> = new Map<string, ApplicationIntegrationViewModel>();
  configurations: any = {};

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private mcService: MailChimpService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private router: Router,
    private data: MemoryDataHolderServiceService
  ) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];
    }

    if (this.appId) {
      this.integrations = <Map<string, ApplicationIntegrationViewModel>>this.data.store.get("integrations");
      if (!this.integrations) {
        this.integrations = new Map<string, ApplicationIntegrationViewModel>();
        let id = Number(this.appId);
        this.appservice.getApplicationIntegrationsById(id).subscribe(a => {
          for (var i in a) {
            this.integrations[a[i].code] = a[i];
          }

          this.data.store.set("integrations", this.integrations);
          if (this.integrations['mailchimp'] && this.integrations['mailchimp'].configurations) {
            this.integrations['mailchimp'].configurations.forEach(a => {
              this.configurations[a.key] = a.value;
            })
          }
        });
      } else if (this.integrations && this.integrations['mailchimp'] && this.integrations['mailchimp'].configurations) {
        this.integrations['mailchimp'].configurations.forEach(a => {
          this.configurations[a.key] = a.value;
        })
      }

      this.loadApplication(this.appId).subscribe(a => {
        let params: Params = this.route.snapshot.queryParams;
        if (params != null && params['code']) {
          this.loadLists(params['code']);
        }
      });
    } else {
      this.router.navigate(['/applications/view/' + this.appId]);
    }
  }

  private loadApplication(id: any): Observable<ApplicationViewDataModel> {
    var obs = this.appservice.getApplicationById(id);
    obs.subscribe(a => {
      this.application = a;
      this.status = a.status == "Active";
      this.breadcrumbService.show([
        {title: "Applications", url: "/applications"},
        {title: a.applicationName, url: "/applications/view/" + a.id},
        {title: "Integrations"},
        {title: "MailChimp"}
      ]);
    }, e => {
      this.router.navigate(['/applications/view/' + this.appId]);
    });

    return obs;
  }

  loadLists(code) {
    this.mcService.lists(code, environment.baseUrl + "/applications/view/" + this.appId + "/integrations/mailchimp").subscribe(a => {
      this.lists = a.lists;
      this.accessToken = a.accessToken,
        this.mcDataCenter = a.url,
        this.mcLoggedIn = true;
    }, e => {
      
    })
  }

  login() {
    var clientId = environment.integrations.mailchimp.clientId;
    var redirect = environment.baseUrl + "/applications/view/" + this.appId + "/integrations/mailchimp";
    //redirect = redirect.replace("http://", "https://");
    window.location.href = this.mcUrl + "?response_type=code&client_id=" + clientId + "&redirect_uri=" + redirect;
  }

  subscribe() {
    //send to server for registration
    var subscribeRequest: MailChimpSubscriptionDataCreateModel = {
      listId: this.list.id,
      applicationId: this.application.id,
      accessToken: this.accessToken,
      url: this.mcDataCenter,
      webId: this.list['web_id']
    };
    this.mcService.subscribe(subscribeRequest).subscribe(b => {
      this.data.store.set("integrations", null);
      this.notify.success("Successfully subscribed " + this.list.name + " to Koraki");
      this.router.navigate(['/applications/view/' + this.appId]);
    }, e => {
      this.notify.error("Error occured while subscribing " + this.list.name + " to Koraki");
    })
  }

  disconnect() {
    let id = Number(this.appId);
    this.mcService.unsubscribe(id).subscribe(a => {
      this.data.store.set("integrations", null);
      this.notify.success("Successfully unsubscribed from MailChimp list");
      this.router.navigate(['/applications/view/' + this.appId]);
    }, e => {
      this.notify.error("Unsubscribe was not success");
    })
  }

  convertUrl(url) {
    return url.replace("api", "admin");
  }
}
