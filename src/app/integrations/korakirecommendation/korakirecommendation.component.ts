import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { ApplicationsService } from 'koraki-angular-client';

@Component({
  selector: 'app-korakirecommendation',
  templateUrl: './korakirecommendation.component.html',
  styleUrls: ['./korakirecommendation.component.scss']
})
export class KorakirecommendationComponent implements OnInit {

  appId: string;
  loading: boolean;
  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];

      this.appservice.getApplicationById(Number.parseInt(this.appId)).subscribe(a => {
        this.breadcrumbService.show([
          { title: "Applications", url: "/applications" },
          { title: a.applicationName, url: "/applications/view/" + a.id },
          { title: "Integrations", url: "/applications/view/" + a.id + "/integrations"  },
          { title: "Koraki Recommendation!" }
        ]);
      }, e => {
        this.router.navigate(['/applications/view/' + this.appId]);
      });
    }
  }

}
