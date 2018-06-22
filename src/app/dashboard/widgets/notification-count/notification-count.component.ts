import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'koraki-angular-client';

@Component({
  selector: 'app-notification-count',
  templateUrl: './notification-count.component.html',
  styleUrls: ['./notification-count.component.scss']
})
export class NotificationCountComponent implements OnInit {
  total: number = -1;
  active: number = -1;
  constructor(
    private analyticsservice: AnalyticsService
  ) { }

  ngOnInit() {
    this.load();  
  }

  load(){
    this.total = 0;
    this.active = 0;

    this.analyticsservice.getNotificationCount().subscribe(
      a => {
        this.total = a.totalCount;
        this.active = a.activeCount;
      }
    );
  }

}
