import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { SubscriptionService } from '../../services/subscription.service';
import { formatCurrency } from '@angular/common';
import { environment } from 'environments/environment';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-subscription-main',
  templateUrl: './subscription-main.component.html',
  styleUrls: ['./subscription-main.component.scss']
})
export class SubscriptionMainComponent implements OnInit {
  subscriptionId: number;
  planHeader: string;
  nextBillingDate: Date;
  planName = "Free plan";
  isFree: boolean;
  isTier1: boolean;
  upgradeAvailable: boolean;
  planFeatures: any;
  currentPlanFeatures: any;
  planIcon: string;
  loading: boolean;

  constructor(
    private notification: NotificationService,
    private subscriptions: SubscriptionsService,
    private breadcrumbService: BreadcrumbService,
    private loadingService: LoadingServiceService,
    private subs: SubscriptionService
  ) { }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Subscription", url: "/subscription/plans" }
    ]);

    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    this.loadData();
  }

  cancelSubscription(id: number) {
    var sure = confirm("You are about to remove your subscription. Are you sure?");
    if (sure) {
      this.subscriptions.unsubscribe(id).subscribe(
        a => {
          this.notification.success("Subscription removed");
          this.loadData();
        }, e => {
          this.notification.error("Error occured while removing subscription. Contact support if this error persists");
          this.loadData();
        });
    }
  }

  loadData() {
    this.subs.clear();
    this.subs.permissions().subscribe(a => {
      this.subscriptionId = a.id;
      this.planHeader = a.planName + " - " + formatCurrency(a.cost, "en-US", "$");
      this.planName = a.planName;
      this.nextBillingDate = a.nextBilling;
      this.isFree = a.cost == 0;
      this.upgradeAvailable = a.plan != "tier2" && a.plan.indexOf("shopify")==-1;
      this.isTier1 = a.plan == "tier1";
      this.planFeatures = environment.plans;
      this.currentPlanFeatures = this.planFeatures[a.plan].filter(a => !a.startsWith('~'));
      this.planIcon = environment.planIcons[a.plan];
    });
  }
}
