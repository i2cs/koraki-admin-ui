import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  appCount: number = -1;

  public ngOnInit() {}

  appCountUpdated(e){
    this.appCount = e;
  }
}
