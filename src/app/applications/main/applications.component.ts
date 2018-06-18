import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicationsService, ApplicationViewDataModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';

declare const $: any;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})

export class ApplicationsComponent implements OnInit, AfterViewInit {

  applications: Array<ApplicationViewDataModel>;
  loading: boolean;

  constructor(
    private appservice: ApplicationsService,
    private loadingService: LoadingServiceService,
    private cache: MemoryDataHolderServiceService) { }

  ngOnInit() {
    if(this.cache.store.has("applications")){
      this.applications = <Array<ApplicationViewDataModel>>(this.cache.store.get("applications"));
    }
    this.load();
    setInterval(() => { this.load() }, 60000);
  }

  load(): any {
    if (this.loading) return;
    this.loading = true;
    this.loadingService.loading(true);
    this.appservice.getAllApplications().subscribe(a => {
      this.applications = a.items;
      this.loadingService.loading(false);
      this.loading = false;
      this.cache.store.set("applications", this.applications);
    }, e => {
      this.loadingService.loading(false);
      this.loading = false;
    });
  }

  ngAfterViewInit() { }
}
