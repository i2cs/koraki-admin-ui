import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ApplicationsService, ApplicationViewDataModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { SubscriptionService } from '../../services/subscription.service';

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

  constructor(
    private appservice: ApplicationsService,
    private loadingService: LoadingServiceService,
    private breadcrumbService: BreadcrumbService,
    private cache: MemoryDataHolderServiceService,
    public notify: NotificationService,
    private subscription: SubscriptionService
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

    this.subscription.permissions().subscribe(a => {
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

  ngAfterViewInit() { }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
