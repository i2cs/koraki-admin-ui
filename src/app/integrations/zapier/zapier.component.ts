import { Component, OnInit } from '@angular/core';
import { ApplicationsService, ApplicationViewDataModel, ApplicationIntegrationViewModel, ZapierService } from 'koraki-angular-client';
import { ActivatedRoute, Router } from '@angular/router';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-zapier',
  templateUrl: './zapier.component.html',
  styleUrls: ['./zapier.component.scss']
})
export class ZapierComponent implements OnInit {

  clientId: string;
  clientSecret: string;
  appId: string;
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};
  status: boolean;
  integrations: Map<string, ApplicationIntegrationViewModel> = new Map<string, ApplicationIntegrationViewModel>();
  configurations: any = {};
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private data: MemoryDataHolderServiceService,
    private zapierService: ZapierService
  ) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];
    }

    if (this.appId) {
      this.integrations = <Map<string, ApplicationIntegrationViewModel>>this.data.store.get("integrations");
      if (!this.integrations) {
        this.integrations = new Map<string, ApplicationIntegrationViewModel>();
        let id = Number(this.appId);
        this.appservice.getApplicationIntegrationsById(id).subscribe(a => {
          for (var i in a) {
            this.integrations[a[i].code] = a[i];
          }

          this.data.store.set("integrations", this.integrations);
          if (this.integrations['zapier'] && this.integrations['zapier'].configurations) {
            this.integrations['zapier'].configurations.forEach(a => {
              this.configurations[a.key] = a.value;
            })
          }
        });
      } else if (this.integrations && this.integrations['zapier'] && this.integrations['zapier'].configurations) {
        this.integrations['zapier'].configurations.forEach(a => {
          this.configurations[a.key] = a.value;
        })
      }

      this.loadApplication(this.appId);
    } else {
      this.router.navigate(['/applications/view/' + this.appId]);
    }
  }

  disconnect() {
    var confirmed = confirm("Are you sure you want to disconnect Zapier?");
    if (confirmed) {
      this.zapierService.unsubscribe(Number.parseInt(this.appId)).subscribe(a => {
        this.notify.success("Successfuly disconnected from Zapier");
        this.router.navigate(['/applications/view/' + this.appId]);
      })
    }
  }

  private loadApplication(id: any): Observable<ApplicationViewDataModel> {
    var obs = this.appservice.getApplicationById(id);
    obs.subscribe(a => {
      this.application = a;
      this.clientId = a.clientId;
      this.clientSecret = a.clientSecret;
      this.status = a.status == "Active";
      this.breadcrumbService.show([
        { title: "Applications", url: "/applications" },
        { title: a.applicationName, url: "/applications/view/" + a.id },
        { title: "Integrations" },
        { title: "Zapier" }
      ]);
    }, e => {
      this.router.navigate(['/applications/view/' + this.appId]);
    });

    return obs;
  }

}
