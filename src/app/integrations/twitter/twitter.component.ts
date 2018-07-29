import { Component, OnInit } from '@angular/core';
import { TwitterService, ApplicationsService, ApplicationViewDataModel, ApplicationIntegrationViewModel, TwitterSubscribeCreateViewModel } from 'koraki-angular-client';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { NotificationService } from '../../services/notification.service';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {
  appId: any;
  loading: boolean;
  username: string;
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};
  status: boolean;
  integrations: Map<string, ApplicationIntegrationViewModel> = new Map<string, ApplicationIntegrationViewModel>();
  configurations: any = {};

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private twitterService: TwitterService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private breadcrumbService: BreadcrumbService,
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
          if (this.integrations['twitter'] && this.integrations['twitter'].configurations) {
            this.integrations['twitter'].configurations.forEach(a => {
              this.configurations[a.key] = a.value;
            })
          }
        });
      } else if (this.integrations && this.integrations['twitter'] && this.integrations['twitter'].configurations) {
        this.integrations['twitter'].configurations.forEach(a => {
          this.configurations[a.key] = a.value;
        })
      }

      this.loadApplication(this.appId);
    } else {
      this.router.navigate(['/applications']);
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
        {title: "Twitter"}
      ]);
    }, e => {
      this.router.navigate(['/applications']);
    });

    return obs;
  }

  subscribe(){
    var model :TwitterSubscribeCreateViewModel = {
      applicationId: this.appId,
      twitterUsername: this.username
    };
    this.twitterService.subscribe(model).subscribe(a => {
      this.data.store.set("integrations", null);
      this.notify.success("Successfully subscribed to @" + this.username);
      this.router.navigate(['/applications']);
    }, e => {
      this.notify.error(e.error.message);
    })
  }

  unsubscribe(){
    this.twitterService.unsubscribe(this.appId).subscribe(a => {
      this.data.store.set("integrations", null);
      this.notify.success("Successfully unsubscribed from @" + this.configurations['username']);
      this.router.navigate(['/applications']);
    });
  }
}
