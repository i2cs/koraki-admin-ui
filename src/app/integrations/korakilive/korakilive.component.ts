import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { ApplicationsService } from 'koraki-angular-client';
import { LoadingServiceService } from 'app/services/loading-service.service';

@Component({
  selector: 'app-korakilive',
  templateUrl: './korakilive.component.html',
  styleUrls: ['./korakilive.component.scss']
})
export class KorakiliveComponent implements OnInit {

  appId: string;
  loading: boolean;
  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private loadingService: LoadingServiceService,
  ) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];

      this.appservice.getApplicationById(Number.parseInt(this.appId)).subscribe(a => {
        this.breadcrumbService.show([
          { title: "Applications", url: "/applications" },
          { title: a.applicationName, url: "/applications/view/" + a.id },
          { title: "Integrations", url: "/applications/view/" + a.id + "/integrations"  },
          { title: "Koraki Live!" }
        ]);
      }, e => {
        this.router.navigate(['/applications/view/' + this.appId]);
      });
    }
  }

}
