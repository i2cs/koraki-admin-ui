import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AnalyticsService } from 'koraki-angular-client';
import { ErrorService } from '../../../services/error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-count',
  templateUrl: './app-count.component.html',
  styleUrls: ['./app-count.component.scss']
})
export class AppCountComponent implements OnInit {
  count: number = -1;
  @Output() countLoaded = new EventEmitter<number>();
  @Input() maxAllowedApps: number;
  
  constructor(
    private analyticsservice: AnalyticsService,
    private router: Router
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

  subscribePage(){
    this.router.navigate(['/subscription/plans']);
  }

  createApp(){
    this.router.navigate(['/applications/new']);
  }
}
