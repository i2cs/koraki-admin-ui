import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  appCount: number = -1;
  maxAllowedApps: string;

  constructor(
    private subscription: SubscriptionService
  ) { }

  public ngOnInit() {
    this.subscription.permissions().subscribe(a => {
      this.maxAllowedApps = a.permissons["applications.maximum"];
    });
  }

  appCountUpdated(e) {
    this.appCount = e;
  }
}
