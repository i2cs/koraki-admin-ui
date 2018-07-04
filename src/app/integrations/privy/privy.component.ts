import { Component, OnInit } from '@angular/core';
import { PrivyService, ApplicationsService } from 'koraki-angular-client';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';

@Component({
  selector: 'app-privy',
  templateUrl: './privy.component.html',
  styleUrls: ['./privy.component.scss']
})
export class PrivyComponent implements OnInit {
  webhook: string;
  loading: boolean;
  appId: any;

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private privy: PrivyService,
    private loadingService: LoadingServiceService
  ) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    if (this.route.snapshot.params['id']) {
      this.appId = this.route.snapshot.params['id'];

      this.appservice.getApplicationById(this.appId).subscribe(a => {
        this.privy.getWebhookUrl(this.appId).subscribe(b => {
          this.webhook = b;
        });
      });
    }
  }

}
