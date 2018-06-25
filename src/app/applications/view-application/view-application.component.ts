import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService, ApplicationViewDataModel, ApplicationUpdateDataModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';

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

export class ViewApplicationComponent implements OnInit {
  
  hide: boolean;
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};
  script: string;
  status: boolean;
  updatingSettings: boolean;
  possibleCounts: number[] = _Array.range(8, 100, 1);

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private loadingService: LoadingServiceService,
    public router: Router,
    public notify: NotificationService
  ) { }

  ngOnInit() {
    this.hide = true;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadingService.loading(true);
        this.appservice.getApplicationById(params['id']).subscribe(a => {
          this.loadingService.loading(false);
          this.application = a;
          this.status = a.status == "Active";
          this.script = "<script>window.sparkleSettings = { app_id: \"" + a.clientId + "\", analytics_id: \"" + a.analyticsId + "\" }; !function(){function t(){var t=a.createElement(\"script\"); t.type=\"text/javascript\", t.async=!0,t.src=\"\/\/api.koraki.io//widget/v1.0/js\"; var e=a.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(t,e)} var e=window,a=document;e.attachEvent?e.attachEvent(\"onload\",t):e.addEventListener(\"load\",t,!1)}();</script>"
        }, e => {
          this.loadingService.loading(false);
        });

        this.route.queryParams.subscribe(query => {
          if (query['new']) {
            this.notify.success("Application created!");
          }
        });
      }
    });
  }

  updateApplicationStatus() {
    this.loadingService.loading(true);
    let status: ApplicationUpdateDataModel.StatusEnum = this.status ? ApplicationUpdateDataModel.StatusEnum.Active : ApplicationUpdateDataModel.StatusEnum.Disabled;
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{ status: status }).subscribe(a => {
      this.loadingService.loading(false);
      this.application = a;
      this.notify.success("Application is " + status.toString());
    }, e => {
      this.loadingService.loading(false);
    });
  }

  updateApplicationSettings() {
    this.updatingSettings = true;
    this.loadingService.loading(true);
    this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{
      notificationMaximumActiveCount: this.application.notificationMaximumActiveCount,
      notificationMaximumDurationDays: this.application.notificationMaximumDurationDays
    }).subscribe(a => {
      this.updatingSettings = false;
      this.loadingService.loading(false);
      this.application = a;
      this.notify.success("Application settings saved");
    }, e => {
      this.updatingSettings = false;
      this.loadingService.loading(false);
    });
  }

  deleteApplication() {
    var result = confirm("Are you sure you want to delete this application? This action is not reversible");
    if (result) {
      this.loadingService.loading(true);
      this.appservice.deleteApplication(this.application.id).subscribe(a => {
        this.loadingService.loading(false);
        this.notify.success("Application deleted!");
        this.router.navigate(['/applications']);
      }, e => {
        this.loadingService.loading(false);
      });
    }
  }

}
