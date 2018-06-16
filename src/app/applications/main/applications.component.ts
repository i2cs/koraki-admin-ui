import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicationsService, ApplicationViewDataModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';

declare const $: any;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})

export class ApplicationsComponent implements OnInit, AfterViewInit {
  applications: Array<ApplicationViewDataModel>;

  constructor(
    private appservice: ApplicationsService,
    private loadingService: LoadingServiceService) { }

  ngOnInit() {
    this.loadingService.loading(true);
    this.appservice.getAllApplications().subscribe(a => {
      this.applications = a.items;
      this.loadingService.loading(false);
    }, e => {
      this.loadingService.loading(false);
    });
  }

  ngAfterViewInit() { }
}
