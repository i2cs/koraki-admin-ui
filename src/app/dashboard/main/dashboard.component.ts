import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  appCount: number = -1;
  maxAllowedApps: number = 1;

  constructor(
    private subscription: SubscriptionService
  ) { }

  public ngOnInit() {
    this.subscription.permissions().subscribe(a => {
      if (a.permissons["applications.maximum"]) {
        this.maxAllowedApps = Number.parseInt(a.permissons["applications.maximum"]);
      }
    });
  }

  appCountUpdated(e) {
    this.appCount = e;
  }
}
