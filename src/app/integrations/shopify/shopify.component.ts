import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationViewDataModel, ApplicationIntegrationViewModel, ApplicationsService, ShopifyService } from 'koraki-angular-client';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { ShopifySubscribeCreateViewModel } from 'koraki-angular-client/model/shopifySubscribeCreateViewModel';

@Component({
  selector: 'app-shopify',
  templateUrl: './shopify.component.html',
  styleUrls: ['./shopify.component.scss']
})
export class ShopifyComponent implements OnInit {
  @ViewChild("storeId") inputEl: ElementRef;
  application: ApplicationViewDataModel = <ApplicationViewDataModel>{};
  status: boolean;
  integrations: Map<string, ApplicationIntegrationViewModel> = new Map<string, ApplicationIntegrationViewModel>();
  configurations: any = {};
  loading: boolean;
  appId: any;
  shopifyLogged: boolean;
  store: string;
  integrated: boolean;

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private shopifyService: ShopifyService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private router: Router,
    private data: MemoryDataHolderServiceService
  ) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe(a => { this.loading = a; });

    if (this.route.snapshot.params['id'] && this.route.snapshot.params['id'] != "~") {
      this.appId = this.route.snapshot.params['id'];
    } else {
      let queryParams = this.route.snapshot.queryParamMap;
      if (queryParams != null) {
        let code = queryParams.get("code");
        let shop = queryParams.get("shop");
        if (code) {
          let state = queryParams.get("state");;
          if (state.indexOf(":") >= 0) {
            let stateParts = state.split(":");
            this.appId = stateParts[1];
            if (this.appId) {
              let model: ShopifySubscribeCreateViewModel = {
                applicationId: this.appId,
                code: code,
                shopUrl: shop
              }
              this.shopifyService.subscribe(model).subscribe(a => {
                this.notify.success("Successfully subscribed");
                this.router.navigate(['/applications/view/' + this.appId]);
                this.data.store.set("integrations_" + this.appId, null);
              }, e => {
                this.notify.error(e.error.message);
                this.data.store.set("integrations_" + this.appId, null);
              });
            }
          }
        }
      }
    }

    let id = Number(this.appId);
    this.integrations = <Map<string, ApplicationIntegrationViewModel>>this.data.store.get("integrations_" + id);
    if (!this.integrations) {
      this.integrations = new Map<string, ApplicationIntegrationViewModel>();
      this.appservice.getApplicationIntegrationsById(id).subscribe(a => {
        for (var i in a) {
          this.integrations[a[i].code] = a[i];
        }

        this.data.store.set("integrations_" + id, this.integrations);
        if (this.integrations['shopify'] && this.integrations['shopify'].configurations) {
          this.integrated = true;
          this.integrations['shopify'].configurations.forEach(a => {
            this.configurations[a.key] = a.value;
          })
        }
      });
    } else if (this.integrations && this.integrations['shopify'] && this.integrations['shopify'].configurations) {
      this.integrated = true;
      this.integrations['shopify'].configurations.forEach(a => {
        this.configurations[a.key] = a.value;
      });
    }

    if (this.appId) {
      this.loadApplication(this.appId);
    } else {
      this.router.navigate(['/applications/view/' + this.appId]);
    }
  }

  private loadApplication(id: any) {
    this.appservice.getApplicationById(id).subscribe(a => {
      this.application = a;
      this.status = a.status == "Active";
      this.breadcrumbService.show([
        { title: "Applications", url: "/applications" },
        { title: a.applicationName, url: "/applications/view/" + a.id },
        { title: "Integrations" },
        { title: "Shopify" }
      ]);
    }, e => {
      this.router.navigate(['/applications/view/' + this.appId]);
    });
  }

  subscribe() {
    if (this.store == "") {
      this.inputEl.nativeElement.focus();
    } else {
      this.shopifyService.getMetadata(this.appId, this.store).subscribe(a => {
        var url = a.authUrl + "&state=add:" + this.appId;
        window.location.href = url;
      }, e => {
        this.notify.error(e.error.message);
      });
    }
  }

  disconnect() {
    var confirmed = confirm("Are you sure you want to remove Shopify integration?");
    if (confirmed) {
      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.shopifyService.unsubscribe(this.appId).subscribe(a => {
      this.notify.success("Successfully unsubscribed");
      this.router.navigate(['/applications/view/' + this.appId]);
      this.data.store.set("integrations_" + this.appId, null);
    }, e => {
      this.notify.error("Error returned - " + e.error.message);
    })
  }

}
