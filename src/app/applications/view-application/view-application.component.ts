import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService, ApplicationViewDataModel } from 'koraki-angular-client';

declare const $: any;

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss']
})
export class ViewApplicationComponent implements OnInit {
  hide: boolean;
  loadingApp: boolean;
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};

  constructor(private route: ActivatedRoute, private appservice: ApplicationsService) { }

  ngOnInit() {
    this.loadingApp = true;
    this.hide = true;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.appservice.getApplicationById(params['id']).subscribe(a => {
          this.loadingApp = false;
          this.application = a;
        }, e => {

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
