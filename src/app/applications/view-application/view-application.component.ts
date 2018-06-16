import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService, ApplicationViewDataModel } from 'koraki-angular-client';
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

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private loadingService: LoadingServiceService) { }

  ngOnInit() {
    this.hide = true;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadingService.loading(true);
        this.appservice.getApplicationById(params['id']).subscribe(a => {
          this.loadingService.loading(false);
          this.application = a;
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

}
