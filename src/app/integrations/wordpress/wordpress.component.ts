import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { ApplicationsService, IntegrationConfigurationsDataViewModel, IntegrationConfig } from 'koraki-angular-client';
import { LoadingServiceService } from 'app/services/loading-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wordpress',
  templateUrl: './wordpress.component.html',
  styleUrls: ['./wordpress.component.scss']
})
export class WordpressComponent implements OnInit {
  
  appId: string;
  loading: boolean;
  notIntegrated: boolean;
  @Input() configs: Observable<Array<IntegrationConfig>>;
  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private loadingService: LoadingServiceService
    ) { }

  ngOnInit() {
    this.configs.subscribe(a => {
      let results = a.filter(b => b.key == "integration:enabled")[0];
      if(results){
        this.notIntegrated = !Boolean(results.value);
      }else{
        this.notIntegrated = true;
      }
    });
    
    let loading = this.loadingService.loading$.subscribe(a => { this.loading = a; if(!a) loading.unsubscribe();})
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];

      this.appservice.getApplicationById(Number.parseInt(this.appId)).subscribe(a => {
        this.breadcrumbService.show([
          { title: "Applications", url: "/applications" },
          { title: a.applicationName, url: "/applications/view/" + a.id },
          { title: "Integrations", url: "/applications/view/" + a.id + "/integrations"  },
          { title: "Wordpress" }
        ]);
      }, e => {
        this.router.navigate(['/applications/view/' + this.appId]);
      });
    }
  }
}
