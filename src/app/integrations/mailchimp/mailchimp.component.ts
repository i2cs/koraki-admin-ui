import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApplicationsService, MailChimpService, ApplicationViewDataModel, MailChimpSubscriptionDataCreateModel } from 'koraki-angular-client';
import { NotificationService } from '../../services/notification.service';
import { LoadingServiceService } from '../../services/loading-service.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

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

  constructor(
    private route: ActivatedRoute,
    private client: HttpClient,
    private appservice: ApplicationsService,
    private mcService: MailChimpService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];
    }

    if (this.appId) {
      this.loadApplication(this.appId).subscribe(a => {
        this.loadingService.loading(true);
        let params: Params = this.route.snapshot.queryParams;
        if (params != null && params['code']) {
          this.loadLists(params['code']);
        }else{
          this.loadingService.loading(false);
        }
      });
    } else {
      this.router.navigate(['/applications']);
    }
  }

  private loadApplication(id: any) : Observable<ApplicationViewDataModel>{
    this.loadingService.loading(true);
    var obs = this.appservice.getApplicationById(id);
    obs.subscribe(a => {
      this.loadingService.loading(false);
      this.application = a;
      this.status = a.status == "Active";
    }, e => {
      this.loadingService.loading(false);
      this.router.navigate(['/applications']);
    });

    return obs;
  }

  loadLists(code){
    this.loadingService.loading(true);
    this.mcService.lists(code, environment.baseUrl + "/integrations/mailchimp/" + this.appId).subscribe(a => {
      this.loadingService.loading(false);
      this.lists = a.lists;
      this.accessToken = a.accessToken,
      this.mcDataCenter = a.url,
      this.mcLoggedIn = true;
    }, e => {
      this.loadingService.loading(false);
    })
  }

  login() {
    var redirect = environment.baseUrl + "/integrations/mailchimp/" + this.appId;
    //redirect = redirect.replace("http://", "https://");
    window.location.href = this.mcUrl + "?response_type=code&client_id=592621747124&redirect_uri=" + redirect;
  }

  subscribe() {
    this.loadingService.loading(true);
    //send to server for registration
    var subscribeRequest: MailChimpSubscriptionDataCreateModel = {
      listId: this.list.id,
      applicationId: this.application.id,
      accessToken: this.accessToken,
      url: this.mcDataCenter
    };
    this.mcService.subscribe(subscribeRequest).subscribe(b => {
      this.loadingService.loading(false);
      this.notify.success("Successfully subscribed " + this.list.name + " to Koraki");
      this.router.navigate(['/applications/view/' + this.appId]);
    }, e => {
      this.loadingService.loading(false);
      this.notify.error("Error occured while subscribing " + this.list.name + " to Koraki<br/>" + e.error.message);
    })
  }
}
