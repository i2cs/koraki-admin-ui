import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingServiceService } from '../../services/loading-service.service';
import { environment } from 'environments/environment';
import { ApplicationsService, ApplicationViewDataModel, FacebookService, FacebookPageSubscriptionDataCreateModel, ApplicationIntegrationViewModel } from 'koraki-angular-client';
import { NotificationService } from '../../services/notification.service';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {
  fbUrl: string = "https://www.facebook.com/v3.0/";
  fbGraphUrl: string = "https://graph.facebook.com/v3.0/";
  fbLoggedIn: boolean;
  accessToken: string;
  appId: string;
  page: any;
  pages: any[];
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};
  status: boolean;
  integrations: Map<string, ApplicationIntegrationViewModel> = new Map<string, ApplicationIntegrationViewModel>();
  configurations: any = {};
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private client: HttpClient,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private fbService: FacebookService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private router: Router,
    private data: MemoryDataHolderServiceService
  ) { }

  ngOnInit() {
    let needToUnsubscribe = false;
    this.loadingService.loading$.subscribe(a => { this.loading = a; });

    if (this.route.snapshot.params['id'] && this.route.snapshot.params['id'] != "~") {
      this.appId = this.route.snapshot.params['id'];
    } else {
      let fragment: string = this.route.snapshot.fragment;
      if (fragment != null) {
        this.accessToken = this.getFragmentParameter(fragment, "access_token");
        if (this.accessToken) {
          let state = decodeURIComponent(this.getFragmentParameter(fragment, "state"));
          if (state.indexOf(":") >= 0) {

            let stateParts = state.split(":");

            this.appId = stateParts[1];
            if (this.appId) {
              this.fbLoggedIn = true;

              if (stateParts[0] == "add") {
                this.loadPages();
              }

              if (stateParts[0] == "remove") {
                needToUnsubscribe = true;
              }

              //clear hash
              window.location.hash = '';
            }
          }
        }
      }
    }

    this.integrations = <Map<string, ApplicationIntegrationViewModel>>this.data.store.get("integrations");
    if (!this.integrations) {
      this.integrations = new Map<string, ApplicationIntegrationViewModel>();
      let id = Number(this.appId);
      this.appservice.getApplicationIntegrationsById(id).subscribe(a => {
        for (var i in a) {
          this.integrations[a[i].code] = a[i];
        }

        this.data.store.set("integrations", this.integrations);
        if (this.integrations['facebook'] && this.integrations['facebook'].configurations) {
          this.integrations['facebook'].configurations.forEach(a => {
            this.configurations[a.key] = a.value;
          })
        }
        if (needToUnsubscribe) {
          this.unsubscribe();
        }
      });
    } else if (this.integrations && this.integrations['facebook'] && this.integrations['facebook'].configurations) {
      this.integrations['facebook'].configurations.forEach(a => {
        this.configurations[a.key] = a.value;
      });

      if (needToUnsubscribe) {
        this.unsubscribe();
      }
    }

    if (this.appId) {
      this.loadApplication(this.appId);
    } else {
      this.router.navigate(['/applications/view/' + this.appId]);
    }
  }

  private loadApplication(id: any) {
    this.appservice.getApplicationById(id).subscribe(a => {
      this.application = a;
      this.status = a.status == "Active";
      this.breadcrumbService.show([
        { title: "Applications", url: "/applications" },
        { title: a.applicationName, url: "/applications/view/" + a.id },
        { title: "Integrations" },
        { title: "Facebook" }
      ]);
    }, e => {
      this.router.navigate(['/applications/view/' + this.appId]);
    });
  }

  login(state) {
    let redirect = environment.baseUrl + "/applications/view/~/integrations/facebook";
    let clientId = environment.integrations.facebook.clientId;
    redirect = redirect.replace("http://", "https://");
    window.location.href = this.fbUrl + "dialog/oauth?state=" + state + "&client_id=" + clientId + "&response_type=token&scope=manage_pages&redirect_uri=" + redirect;
  }

  loadPages() {
    //exchange for a long live token
    this.fbService.exchangeToken(this.accessToken).subscribe(token => {
      this.client.get(this.fbGraphUrl + "me/accounts?access_token=" + token).subscribe(a => {
        this.pages = a['data'];
      });
    });
  }

  subscribe() {
    this.client.post(this.fbGraphUrl + this.page.id + "/subscribed_apps", { access_token: this.page.access_token }).subscribe(a => {
      if (a['success']) {
        //send to server for registration
        var subscribeRequest: FacebookPageSubscriptionDataCreateModel = {
          pageId: this.page.id,
          applicationId: this.application.id,
          accessToken: this.page.access_token
        };
        this.fbService.subscribe(subscribeRequest).subscribe(b => {
          this.notify.success("Successfully subscribed " + this.page.name + " to Koraki");
          this.router.navigate(['/applications/view/' + this.appId]);
          this.data.store.set("integrations", null);
        }, e => {
          this.notify.error("Error occured while subscribing " + this.page.name + " to Koraki<br/>" + e.error.message);
        })
      }
    }, e => {
      this.notify.error("Permission error occured while subscribing " + this.page.name + " from Facebook");
    });
  }

  disconnect() {
    var confirmed = confirm("Are you sure you want to remove Facebook integration?");
    if(confirmed){
      this.unsubscribe();
    }
  }

  unsubscribe() {
    let id = Number(this.appId);

    if (this.configurations['fb_long_token']) {
      this.client.delete(this.fbGraphUrl + this.configurations['page_id'] + "/subscribed_apps?access_token=" + this.configurations['fb_long_token']).subscribe(a => {
        if (a['success']) {
          this.notify.success("Successfully unsubscribed from Facebook page");

          this.fbService.unsubscribe(id).subscribe(a => {
            this.data.store.set("integrations", null);
            this.notify.success("Successully removed from integrations");
            this.router.navigate(['/applications/view/' + this.appId]);
          }, e => {
            this.notify.error("Unsubscribe was not success");
          });
        }
      });
    }
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
