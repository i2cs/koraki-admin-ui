import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { ApplicationsService } from 'koraki-angular-client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-opencart',
  templateUrl: './opencart.component.html',
  styleUrls: ['./opencart.component.scss']
})
export class OpencartComponent implements OnInit {
  releases: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.appservice.getApplicationById(this.route.snapshot.params['id']).subscribe(a => {
        this.breadcrumbService.show([
          { title: "Applications", url: "/applications" },
          { title: a.applicationName, url: "/applications/view/" + a.id },
          { title: "Integrations" },
          { title: "OpenCart" }
        ]);
      });
    }
    this.releases.push({
      name: "OpenCart 2.2.x",
      url: "https://github.com/i2cs/koraki-opencart-integration/archive/OC-2.2-v1.0.zip"
    });

    this.releases.push({
      name: "OpenCart 2.3.x",
      url: "https://github.com/i2cs/koraki-opencart-integration/archive/OC-2.3-v1.0.zip"
    });

    this.releases.push({
      name: "OpenCart 3.x",
      url: "https://github.com/i2cs/koraki-opencart-integration/archive/OC-3.0-v1.0.zip"
    });
  }

}
