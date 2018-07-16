import { Component, OnInit } from '@angular/core';
import { IntercomService, ApplicationsService } from 'koraki-angular-client';
import { ActivatedRoute } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-intercom',
  templateUrl: './intercom.component.html',
  styleUrls: ['./intercom.component.scss']
})
export class IntercomComponent implements OnInit {

  webhook: any = {};
  loading: boolean;
  appId: any;

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private intercom: IntercomService,
    private loadingService: LoadingServiceService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];

      this.appservice.getApplicationById(this.appId).subscribe(a => {
        this.breadcrumbService.show([
          { title: "Applications", url: "/applications" },
          { title: a.applicationName, url: "/applications/view/" + a.id },
          { title: "Integrations" },
          { title: "Intercom" }
        ]);

        this.intercom.getWebhookUrl(this.appId).subscribe(b => {
          this.webhook = b;
        });
      });
    }
  }

}
