import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationViewDataModel, ApplicationIntegrationViewModel, ApplicationsService, ShopifyService } from 'koraki-angular-client';
import { MemoryDataHolderServiceService } from '../../services/memory-data-holder-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { ShopifySubscribeCreateViewModel } from 'koraki-angular-client/model/shopifySubscribeCreateViewModel';
import { LocalStorageService } from 'angular-web-storage';
import { not } from '@angular/compiler/src/output/output_ast';
import { environment } from 'environments/environment';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import { AuthService } from 'app/services/auth.service';
import { debug } from 'util';

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
  appId: string;
  appName: string;
  shopifyLogged: boolean;
  store: string;
  integrated: boolean;
  applicationList: ApplicationViewDataModel[];
  knownStore: boolean;
  knownApp: boolean;
  subscribeClicked: boolean;

  constructor(
    private route: ActivatedRoute,
    private appservice: ApplicationsService,
    private breadcrumbService: BreadcrumbService,
    private shopifyService: ShopifyService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private local: LocalStorageService,
    private router: Router,
    private data: MemoryDataHolderServiceService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    let dontRedirect = false;
    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    if (this.local.get("appId")) {
      this.appId = this.local.get("appId");
      this.knownApp = true;
      this.local.remove("appId");
    } else if (this.route.snapshot.params['id'] && this.route.snapshot.params['id'] != "~") {
      this.appId = this.route.snapshot.params['id'];
      this.knownApp = true;
    }

    let queryParams = this.route.snapshot.queryParamMap;
    let shopifyToken = this.local.get("shopify_token");
    let appIdCached = this.local.get("app_id_shopify");
    if(shopifyToken){
      this.local.remove("shopify_token");
    }

    if (queryParams != null) {
      let code = queryParams.get("code");
      let shop = queryParams.get("shop");
      let hmac = queryParams.get("hmac");
      let mode = "";
      if(hmac && shop && !code){
        this.shopifyService.getMetadata(0, shop).subscribe(a => {
          var url = a.authUrl + "&state=auth:0";
          this.loadingService.loading(true);
          window.top.location.href = url;
        }, e => {
          this.notify.error(e.error.message);
        });

        return;
      } else if ((code || shopifyToken) && shop) {
        dontRedirect = true;
        let state = queryParams.get("state");
        if ((state && state.indexOf(":") >= 0) || appIdCached) {
          if(state && state.indexOf(":") >= 0){
            let stateParts = state.split(":");
            this.appId = stateParts[1] || "0";
            this.knownApp = true;
            this.local.set("app_id_shopify", this.appId);
            if(stateParts[0] == "auth") 
              mode = "auth";
          }else if(appIdCached){
            this.appId = appIdCached;
          }
          
          let model: ShopifySubscribeCreateViewModel = {
            applicationId: Number(this.appId),
            code: code,
            shopUrl: shop,
            userAccessToken: this.auth.getAccessToken(),
            mode: mode
          }

          if(shopifyToken){
            model.token = shopifyToken;
          }

          this.shopifyService.subscribe(model).subscribe(a => {
            if(a.userAccessToken){
              this.auth.setAccessToken(a.userAccessToken);
            }
            
            if(a.result == "redirect"){
              this.local.set("shopify_token", a.token);
              
              this.loadingService.loading(true);
              //in case showing charge auth window
              if(a.redirectUrl == ""){
                window.top.location.reload(true);
              } else {
                window.top.location.href = a.redirectUrl;
              }

              return;
            }

            this.notify.success("Successfully subscribed and fetching recent events");
            if (a.appId > 0) {
              var statusMessage = "We are fetching data from Shopify store. You should be able to see notifications once Koraki is set to active";
              try {
                  statusMessage = window.btoa(statusMessage);
              } catch(e) {}
              this.data.store.set("integrations_" + a.appId, null);
              this.router.navigateByUrl('/applications/view/' + a.appId + '/settings?status=' + statusMessage);
            } else {
              this.router.navigate(['/applications/']);
            }

            return;
          }, e => {
            this.notify.error(e.error.message);
            this.data.store.set("integrations_" + this.appId, null);
          });
        } else {
          this.notify.error("Invalid state. Please try logging in to Shopify again");
        }
      } else if (shop) {
        // initial redirect from shopify. Show koraki apps list
        this.knownStore = true;
        this.store = shop;
        dontRedirect = true;

        if(this.auth.isAuthenticated()){
          this.appservice.getAllApplications("Active", 999).subscribe(a => {
            this.applicationList = a.items;
            if(this.applicationList.length == 0){
              this.appId = "0";
              this.knownApp = true;
              this.appName = "a new";
              this.subscribe();
            }
          }, e => {
            this.notify.error("Error loading applications : " + e.error.message);
          });
        }else{
          this.appId = "0";
          this.knownApp = true;
          this.appName = "a new";
        }
      }
    }

    if (this.appId && this.appId != "0") {
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
    }

    if(this.knownStore && this.knownApp){
      this.subscribe();
    }

    if (!dontRedirect && this.appId != "0") {
      if (this.appId) {
        this.loadApplication(this.appId);
      } else {
        this.router.navigate(['/applications']);
      }
    }
  }

  private loadApplication(id: any) {
    this.appservice.getApplicationById(id).subscribe(a => {
      this.application = a;
      this.status = a.status == "Active";
      this.appName = a.applicationName;
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

  forwardToShopify() {
    this.local.set("appId", this.appId);
    let loginUrl = environment.integrations.shopify.appInstallUrl;
    this.loadingService.loading(true);
    window.location.href = loginUrl;
  }

  subscribe() {
    this.subscribeClicked = true;
    if (this.store == "") {
      this.inputEl.nativeElement.focus();
    } else if (this.appId == null) {
      this.notify.error("Please slect an application first");
    } else {
      this.shopifyService.getMetadata(Number(this.appId), this.store).subscribe(a => {
        var url = a.authUrl + "&state=add:" + this.appId;
        this.loadingService.loading(true);
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
    this.shopifyService.unsubscribe(Number(this.appId)).subscribe(a => {
      this.notify.success("Successfully unsubscribed");
      this.router.navigate(['/applications/view/' + this.appId]);
      this.data.store.set("integrations_" + this.appId, null);
    }, e => {
      this.notify.error("Error returned - " + e.error.message);
    })
  }

}
