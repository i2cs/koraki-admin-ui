import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicationsService, ApplicationViewDataModel } from 'koraki-angular-client';

declare const $: any;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})

export class ApplicationsComponent implements OnInit, AfterViewInit {
  applications: Array<ApplicationViewDataModel>;
  
  constructor(private appservice : ApplicationsService){
    
  }

  ngOnInit() {
    this.appservice.getAllApplications().subscribe(a => {
      this.applications = a.items;
    });
  }

  ngAfterViewInit() {}
}
