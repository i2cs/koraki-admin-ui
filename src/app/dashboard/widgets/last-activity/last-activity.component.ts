import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'koraki-angular-client';

@Component({
  selector: 'app-last-activity',
  templateUrl: './last-activity.component.html',
  styleUrls: ['./last-activity.component.scss']
})
export class LastActivityComponent implements OnInit {
  lastActivity: Date;
  noDate: boolean;

  constructor(
    private analyticsservice: AnalyticsService
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.analyticsservice.getLastActivity().subscribe(
      a => {
        this.lastActivity = a.lastActivity;
        if (a.lastActivity.toString() == "0001-01-01T00:00:00") {
          this.noDate = true;
        }
      }
    );
  }
}
