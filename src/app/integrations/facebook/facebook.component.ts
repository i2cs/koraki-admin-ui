import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingServiceService } from '../../services/loading-service.service';
import { environment } from 'environments/environment';
import { ApplicationsService, ApplicationViewDataModel, FacebookService, FacebookPageSubscriptionDataCreateModel } from 'koraki-angular-client';
import { NotificationService } from '../../services/notification.service';

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

  constructor(
    private route: ActivatedRoute,
    private client: HttpClient,
    private appservice: ApplicationsService,
    private fbService: FacebookService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];
    } else {
      let fragment: string = this.route.snapshot.fragment;
      if (fragment != null) {
        this.accessToken = this.getFragmentParameter(fragment, "access_token");
        if (this.accessToken) {
          this.appId = this.getFragmentParameter(fragment, "state");
          if (this.appId) {
            this.fbLoggedIn = true;
            this.loadPages();

            //clear hash
            window.location.hash = '';
          }
        }
      }
    }

    if (this.appId) {
      this.loadApplication(this.appId);
    } else {
      this.router.navigate(['/applications']);
    }
  }

  private loadApplication(id: any) {
    this.loadingService.loading(true);
    this.appservice.getApplicationById(id).subscribe(a => {
      this.loadingService.loading(false);
      this.application = a;
      this.status = a.status == "Active";
    }, e => {
      this.loadingService.loading(false);
      this.router.navigate(['/applications']);
    });
  }

  login() {
    var redirect = environment.baseUrl + "/integrations/facebook";
    redirect = redirect.replace("http://", "https://");
    window.location.href = this.fbUrl + "dialog/oauth?state=" + this.appId + "&client_id=1710573302367584&response_type=token&scope=manage_pages&redirect_uri=" + redirect;
  }

  loadPages() {
    this.loadingService.loading(true);
    this.client.get(this.fbGraphUrl + "me/accounts?access_token=" + this.accessToken).subscribe(a => {
      this.pages = a['data'];
      this.loadingService.loading(false);
    }, e => {
      this.loadingService.loading(false);
    });
  }

  subscribe() {
    this.loadingService.loading(true);
    this.client.post(this.fbGraphUrl + this.page.id + "/subscribed_apps", { access_token: this.page.access_token }).subscribe(a => {
      if (a['success']) {
        //send to server for registration
        var subscribeRequest : FacebookPageSubscriptionDataCreateModel = {
          pageId : this.page.id,
          applicationId: this.application.id
        };
        this.fbService.subscribe(subscribeRequest).subscribe(b => {
          this.loadingService.loading(false);
          this.notify.success("Successfully subscribed " + this.page.name + " to Koraki");
          this.router.navigate(['/applications/' + this.appId]);
        }, e => {
          this.loadingService.loading(false);
          this.notify.error("Error occured while subscribing " + this.page.name + " to Koraki<br/>" + e.error.message);
        })
      }else{
        this.loadingService.loading(false);
      }
    }, e => {
      this.loadingService.loading(false);
      this.notify.error("Permission error occured while subscribing " + this.page.name + " from Facebook");
    });
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
