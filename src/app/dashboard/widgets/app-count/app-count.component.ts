import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AnalyticsService } from 'koraki-angular-client';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-app-count',
  templateUrl: './app-count.component.html',
  styleUrls: ['./app-count.component.scss']
})
export class AppCountComponent implements OnInit {
  count: number = -1;
  @Output() countLoaded = new EventEmitter<number>();
  
  constructor(
    private analyticsservice: AnalyticsService
  ) { }

  ngOnInit() {
    this.load()
  }

  load(){
    this.count = 0;
    this.analyticsservice.getApplicationCount().subscribe(
      a => {
        this.count = a.count;
        this.countLoaded.next(a.count);
      }
    );
  }

}
