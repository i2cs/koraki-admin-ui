import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService, ApplicationViewDataModel, ApplicationUpdateDataModel, ApplicationIntegrationViewModel, SubscriptionsDataViewModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { SubscriptionService } from '../../services/subscription.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'app/services/auth.service';
import { Observable } from 'rxjs';

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
  styleUrls: ['./view-application.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ViewApplicationComponent implements OnInit, AfterViewInit {
  showClientId: boolean;
  loading: boolean;
  hide: boolean;
  appId: string;
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{ applicationName: "Loading..", url: "Loading.." };
  script: string;
  status: boolean;
  updatingSettings: boolean;
  possibleCounts: number[] = _Array.range(8, 100, 1);
  possibleDays: number[] = _Array.range(1, 100, 1);
  updated: { name: string } = { name: "" };
  nameEditing: boolean;
  paid: boolean = false;
  allowedSessionCount: number;
  sessions: number;
  configs: any = {};
  selectedTab: number = 0;
  defautConfigs = { "notification_live_text_color": "#ffffff", "notification_live_ripple_color": "#f9cb33", "notification_bg_color": "rgb(255,255,255)", "notification_text_color": "rgb(95,95,95)", "notification_link_color": "rgb(156,169,183)", "notification_footer_color": "rgb(161,161,161)", "notification_border_color": "rgb(255,255,255)", "notification_close_color": "rgb(132,132,132)", "notification_border_radius": 5, "notification_image_radius": 0, "position": "bottom-left", "mobile_position": "bottom", "show_on_mobile" : true, "animate" : "up", "start_delay": 2000, "roll_delay": 3000, "display_duration": 9500 }
  tabIndex = {
    "details": 0,
    "integrations": 1,
    "notifications": 2,
    "customize": 3,
    "settings": 4,
    "analytics": 5
  };
  statusCustomMessage;
  reloadNotifications: EventEmitter<boolean> = new EventEmitter();
  permissions: Observable<SubscriptionsDataViewModel>;
  subpage: string;
  subpageEmitter: EventEmitter<string> = new EventEmitter<string>();
  whitelabel: boolean;

  constructor(
    private route: ActivatedRoute,
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

  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      if (params['page']) {
        this.selectedTab = this.tabIndex[params['page']];
        this.subpageEmitter.emit(params['integration']);
        this.subpage = params['integration'];
      } else {
        this.selectedTab = 0
      }
    });

    if(this.auth.isAuthenticated()){
      this.subscription.clear();
      this.permissions.subscribe(a => {
        if (a.permissons["unique_sessions.maximum"]) {
          this.allowedSessionCount = Number.parseInt(a.permissons["unique_sessions.maximum"]);
          this.setProgress();
        }

        if (a.permissons["whitelabel"] == "true") {
          this.whitelabel = true;
        }

        let number = Number.parseInt(a.permissons['notifications_active_per_app.maximum']);
        this.possibleCounts = _Array.range(1, Math.min(number, 100), 1);
        if (number > 100) {
          this.possibleCounts.push(1000);
        }
        this.paid = a.permissons['paid'] === "true";
      });
    }
  }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Applications", url: "/applications" }
    ]);
    this.permissions = this.subscription.permissions();
    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    this.hide = true;
    this.route.params.subscribe(params => {
      if (params['id'] && this.auth.isAuthenticated()) {
        this.appId = params['id'];
        this.appservice.getApplicationById(params['id']).subscribe(a => {
          this.application = a;
          this.status = a.status == "Active";
          this.parseCustomData(a);
          this.script = "<script async=\"true\" src=\"\/\/api.koraki.io/widget/v1.0/js/" + a.clientId + "\"></script>";
          //this.script = "<script>window.sparkleSettings = { app_id: \"" + a.clientId + "\" }; !function(){function t(){var t=a.createElement(\"script\"); t.type=\"text/javascript\", t.async=!0,t.src=\"\/\/api.koraki.io/widget/v1.0/js\"; var e=a.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(t,e)} var e=window,a=document;e.attachEvent?e.attachEvent(\"onload\",t):e.addEventListener(\"load\",t,!1)}();</script>"
          this.breadcrumbService.show([
            { title: "Applications", url: "/applications" },
            { title: a.applicationName, url: "/applications/view/" + a.id }
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

    this.route.queryParams.subscribe(query => {
      if(query['status']){
        try{
          this.statusCustomMessage = window.atob(query['status']);
        } catch(e) {}
      }
    });
  }

  selectedTabChanged(){
    var routeName = Object.keys(this.tabIndex)[this.selectedTab];
    if(routeName == "integrations" && this.subpage){
      routeName = routeName + "/" + this.subpage;
    }
    this.router.navigate(['/applications/view/' + this.appId + '/' + routeName], {queryParamsHandling: "preserve"});
    if(routeName == "notifications"){
      this.reloadNotifications.emit(true);
    }
  }

  setTab(tab: number) {
    this.selectedTab = tab;
  }

  setProgress() {
    if (this.application.uniqueVisitors && this.allowedSessionCount) {
      this.sessions = Number((this.application.uniqueVisitors / this.allowedSessionCount) * 100);
      if (this.sessions > 100) {
        this.sessions = 100;
      }
    }
  }

  updateApplicationStatus() {
    let status: ApplicationUpdateDataModel.StatusEnum = this.status ? ApplicationUpdateDataModel.StatusEnum.Active : ApplicationUpdateDataModel.StatusEnum.Disabled;
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{ status: status }).subscribe(a => {
      this.application = a;
      this.parseCustomData(a);
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
      notificationMaximumDurationDays: this.application.notificationMaximumDurationDays,
      customData: JSON.stringify({ 
        show_on_mobile: this.configs.show_on_mobile,
        position: this.configs.position,
        mobile_position: this.configs.mobile_position,
        start_delay: this.configs.start_delay,
        roll_delay: this.configs.roll_delay,
        display_duration: this.configs.display_duration,
        whitelabel_text: this.configs.whitelabel_text,
        whitelabel_url: this.configs.whitelabel_url
       })
    }).subscribe(a => {
      this.updatingSettings = false;
      this.application = a;
      this.parseCustomData(a);
      this.notify.success("Application settings saved");
    }, e => {
      this.updatingSettings = false;
    });
  }

  updateApplicationCustomization() {
    let cusomizations = JSON.stringify(this.configs);
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{ customData: cusomizations }).subscribe(a => {
      this.application = a;
      this.parseCustomData(a);
      this.notify.success("Notification customization saved");
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  resetToDefault() {
    this.configs = this.defautConfigs;
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

  updateName() {
    this.updatingSettings = true;
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{
      applicationName: this.updated.name
    }).subscribe(a => {
      this.updatingSettings = false;
      this.application = a;
      this.nameEditing = false;
      this.parseCustomData(a);
      this.notify.success("Application name updated");
      this.notify.loadApplications.emit(true);
    }, e => {
      this.updatingSettings = false;
      this.nameEditing = false;
      this.notify.error("Could not update the application name");
    });
  }

  private parseCustomData(a: ApplicationViewDataModel) {
    a.customData = a.customData || "{}";

    try {
      this.configs = JSON.parse(a.customData);
    
      if (this.configs) {
        for (var i in this.defautConfigs) {
          if (!(i in this.configs)) {
            this.configs[i] = this.defautConfigs[i];
          }
        }
      }
    }
    catch (Error) {
      console.error("Error trying to parse custom data : " + a.customData);
    }
  }

  getUrl(url: string){
    var prefix = 'http://';
    if (!/^https?:\/\//i.test(url)) {
      url = prefix + url;
    }

    return url;
  }

  sanitize(url: string) {
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
