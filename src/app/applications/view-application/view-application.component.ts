import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService, ApplicationViewDataModel, ApplicationUpdateDataModel, ApplicationIntegrationViewModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { ErrorService } from '../../services/error.service';

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

  loading: boolean;
  hide: boolean;
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};
  integrations: Map<string, ApplicationIntegrationViewModel> = new Map<string, ApplicationIntegrationViewModel>();
  script: string;
  status: boolean;
  mobile: boolean;
  updatingSettings: boolean;
  allIntegrations: any[] = Array();
  allIntegrationsOriginal: any[] = Array();
  possibleCounts: number[] = _Array.range(8, 100, 1);
  filter: string;

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private loadingService: LoadingServiceService,
    private router: Router,
    private notify: NotificationService,
    private data: MemoryDataHolderServiceService
  ) { }

  ngAfterViewInit(){
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.integrations = <Map<string, ApplicationIntegrationViewModel>>this.data.store.get("integrations");
        if (!this.integrations) {
          this.integrations = new Map<string, ApplicationIntegrationViewModel>();
          this.appservice.getApplicationIntegrationsById(params['id']).subscribe(a => {
            for (var i in a) {
              this.integrations[a[i].code] = a[i];
            }

            this.data.store.set("integrations", this.integrations);
          });
        }
      }
    });
  }

  ngOnInit() {
    this.allIntegrations.push({
      code: "opencart",
      title: "OpenCart 2.x",
      description: "Module contains notification widget. This module can be installed from OpenCart admin panel",
      capable: "This integration can <b>Read</b> and <b>Write</b> notifications",
      buttonTitle: "Download",
      ecommerce: true
    });

    this.allIntegrations.push({
      code: "facebook",
      title: "Facebook Page",
      description: "Module contains notification widget. This module can be installed from OpenCart admin panel",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Integrate",
      ecommerce: false
    });

    this.allIntegrations.push({
      code: "mailchimp",
      title: "MailChimp Integration",
      description: "Module contains notification widget. This module can be installed from OpenCart admin panel",
      capable: "This integration can <b>Write</b> notifications",
      buttonTitle: "Integrate",
      ecommerce: false
    });

    this.allIntegrationsOriginal = this.allIntegrations;

    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    this.hide = true;
    this.route.params.subscribe(params => {
      if (params['id']) {
        //this.loadingService.loading(true);
        this.appservice.getApplicationById(params['id']).subscribe(a => {
          this.application = a;
          this.status = a.status == "Active";
          this.script = "<script>window.sparkleSettings = { app_id: \"" + a.clientId + "\" }; !function(){function t(){var t=a.createElement(\"script\"); t.type=\"text/javascript\", t.async=!0,t.src=\"\/\/api.koraki.io//widget/v1.0/js\"; var e=a.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(t,e)} var e=window,a=document;e.attachEvent?e.attachEvent(\"onload\",t):e.addEventListener(\"load\",t,!1)}();</script>"
        }, e => {
          
        }, () => {
          //this.loadingService.loading(false);
        });

        this.route.queryParams.subscribe(query => {
          if (query['new']) {
            this.notify.success("Application created!");
          }
        });
      }
    });
  }

  filterList() {
    var text = this.filter.toLowerCase();
    this.allIntegrations = this.allIntegrationsOriginal.filter(a => a['title'].toLowerCase().indexOf(text) !== -1);
  }

  updateApplicationStatus() {
    //this.loadingService.loading(true);
    let status: ApplicationUpdateDataModel.StatusEnum = this.status ? ApplicationUpdateDataModel.StatusEnum.Active : ApplicationUpdateDataModel.StatusEnum.Disabled;
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{ status: status }).subscribe(a => {
      //this.loadingService.loading(false);
      this.application = a;
      this.notify.success("Application is " + status.toString());
    }, e => {
      //this.loadingService.loading(false);
    });
  }

  updateApplicationSettings() {
    this.updatingSettings = true;
    //this.loadingService.loading(true);
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{
      notificationMaximumActiveCount: this.application.notificationMaximumActiveCount,
      notificationMaximumDurationDays: this.application.notificationMaximumDurationDays
    }).subscribe(a => {
      this.updatingSettings = false;
      //this.loadingService.loading(false);
      this.application = a;
      this.notify.success("Application settings saved");
    }, e => {
      this.updatingSettings = false;
      //this.loadingService.loading(false);
    });
  }

  deleteApplication() {
    var result = confirm("Are you sure you want to delete this application? This action is not reversible");
    if (result) {
      //this.loadingService.loading(true);
      this.appservice.deleteApplication(this.application.id).subscribe(a => {
        //this.loadingService.loading(false);
        this.notify.success("Application deleted!");
        this.router.navigate(['/applications']);
      }, e => {
        //this.loadingService.loading(false);
      });
    }
  }

}
