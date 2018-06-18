import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService, ApplicationViewDataModel, ApplicationUpdateDataModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';

declare const $: any;

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

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private loadingService: LoadingServiceService,
    public router: Router) { }

  ngOnInit() {
    this.hide = true;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadingService.loading(true);
        this.appservice.getApplicationById(params['id']).subscribe(a => {
          this.loadingService.loading(false);
          this.application = a;
          this.status = a.status == "Active";
          this.script = "<script>window.sparkleSettings = { app_id: \"" + a.clientId + "\" } !function(){function t(){var t=a.createElement(\"script\"); t.type=\"text/javascript\", t.async=!0,t.src=\"\/\/i2csmobile.com/market/index.php?route=extension/module/sparkle/js\"; var e=a.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(t,e)} var e=window,a=document;e.attachEvent?e.attachEvent(\"onload\",t):e.addEventListener(\"load\",t,!1)}();</script>"
        }, e => {
          this.loadingService.loading(false);
        });

        this.route.queryParams.subscribe(query => {
          if (query['new']) {
            $.notify({
              icon: "add_alert",
              message: "Application created!"
            }, {
                type: 'success',
                timer: 4000,
                placement: {
                  from: "top",
                  align: "right"
                }
              }
            );
          }
        });
      }
    });
  }

  updateApplicationStatus(){
    this.loadingService.loading(true);
      let status : ApplicationUpdateDataModel.StatusEnum = this.status ? ApplicationUpdateDataModel.StatusEnum.Active : ApplicationUpdateDataModel.StatusEnum.Disabled;
      this.appservice.updateApplication(this.application.id, <ApplicationUpdateDataModel>{ status : status }).subscribe(a => {
        this.loadingService.loading(false);
        this.application = a;
        $.notify({
          icon: "add_alert",
          message: "Application updated"
        }, {
            type: 'success',
            timer: 2000,
            placement: {
              from: "top",
              align: "right"
            }
          }
        );
      }, e => {
        this.loadingService.loading(false);
      });
  }

  deleteApplication(){
    var result = confirm("Are you sure you want to delete this application? This action is not reversible");
    if(result){
      this.loadingService.loading(true);
      this.appservice.deleteApplication(this.application.id).subscribe(a => {
        this.loadingService.loading(false);

        $.notify({
          icon: "add_alert",
          message: "Application deleted!"
        }, {
            type: 'success',
            timer: 4000,
            placement: {
              from: "top",
              align: "right"
            }
          }
        );

        this.router.navigate(['/applications']);
      }, e => {
        this.loadingService.loading(false);
      });
    }
  }

}
