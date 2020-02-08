import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ApplicationsService, ApplicationViewDataModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { SubscriptionService } from '../../services/subscription.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

declare const $: any;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})

export class ApplicationsComponent implements OnInit, AfterViewInit, OnDestroy {

  applications: Array<ApplicationViewDataModel>;
  loading: boolean;
  interval: any;
  allowedSessionCount: number = 1000;
  isShopify: boolean;

  constructor(
    private appservice: ApplicationsService,
    private loadingService: LoadingServiceService,
    private breadcrumbService: BreadcrumbService,
    private cache: MemoryDataHolderServiceService,
    public notify: NotificationService,
    private subscription: SubscriptionService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Applications", url: "/applications" }
    ]);

    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    if (this.cache.store.has("applications")) {
      this.applications = <Array<ApplicationViewDataModel>>(this.cache.store.get("applications"));
    }
    this.load();
    this.interval = setInterval(() => { this.load() }, 60000);

    this.subscription.clear();
    this.subscription.permissions().subscribe(a => {
      this.isShopify = a.email.startsWith("shopify|");
      if (a.permissons["unique_sessions.maximum"]) {
        this.allowedSessionCount = Number.parseInt(a.permissons["unique_sessions.maximum"]);
      }
    });
  }

  load(): any {
    if (this.loading) return;
    this.loading = true;
    this.appservice.getAllApplications().subscribe(a => {
      this.applications = a.items;
      this.cache.store.set("applications", this.applications);
    }, e => {
      this.notify.error("Error loading applications");
    });
  }

  newApplicationButtonClick(){
    if(this.isShopify){
      window.location.href = environment.integrations.shopify.appInstallUrl;
    }else{
      this.router.navigate(['/applications/new']); 
    }
  }

  getAnalyticsThumbnail(app: ApplicationViewDataModel){
    return this.sanitize("https://analytics.koraki.io/index.php?token_auth=" + app.analyticsToken + "&date=2020-01-25,2020-02-01&forceView=1&viewDataTable=sparkline&module=API&action=get&widget=1&disableLink=0&idSite=" + app.analyticsId + "&period=day&columns=nb_pageviews%2Cnb_uniq_pageviews&colors=%7B%22backgroundColor%22%3A%22%23ffffff%22%2C%22lineColor%22%3A%22%23162c4a%22%2C%22minPointColor%22%3A%22%23ff7f7f%22%2C%22maxPointColor%22%3A%22%2375bf7c%22%2C%22lastPointColor%22%3A%22%2355aaff%22%2C%22fillColor%22%3A%22%23ffffff%22%7D");
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngAfterViewInit() { }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
