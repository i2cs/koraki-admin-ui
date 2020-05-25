import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  appCount: number = -1;
  maxAllowedApps: number = 1;

  constructor(
    private subscription: SubscriptionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.breadcrumbService.show([
      { title: "Dashboard", url: "/dashboard" }
    ]);
    
    this.subscription.permissions().subscribe(a => {
      if (a.permissons["applications.maximum"]) {
        this.maxAllowedApps = Number.parseInt(a.permissons["applications.maximum"]);
      }
    });
  }

  appCountUpdated(e) {
    this.appCount = e;
    if(e == 0){
      this.router.navigate(['applications', 'new'], { queryParams: { "forced": true }});
    }
  }
}
