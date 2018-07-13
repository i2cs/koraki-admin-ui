import { Component, OnInit } from '@angular/core';
import { PrivyService, ApplicationsService } from 'koraki-angular-client';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-privy',
  templateUrl: './privy.component.html',
  styleUrls: ['./privy.component.scss']
})
export class PrivyComponent implements OnInit {
  webhook: string;
  loading: boolean;
  appId: any;

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private privy: PrivyService,
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
          { title: "Privy" }
        ]);

        this.privy.getWebhookUrl(this.appId).subscribe(b => {
          this.webhook = b;
        });
      });
    }
  }

}
