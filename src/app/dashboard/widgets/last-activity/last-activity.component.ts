import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'koraki-angular-client';

@Component({
  selector: 'app-last-activity',
  templateUrl: './last-activity.component.html',
  styleUrls: ['./last-activity.component.scss']
})
export class LastActivityComponent implements OnInit {
  lastActivity: Date;

  constructor(
    private analyticsservice: AnalyticsService
  ) { }

  ngOnInit() {
    this.load();  
  }

  load(){
    this.analyticsservice.getLastActivity().subscribe(
      a => {
        this.lastActivity = a.lastActivity;
      }
    );
  }
}
