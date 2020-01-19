import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { SubscriptionService } from 'app/services/subscription.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  noInvoiceMessage: string;
  hideStripePayments: boolean;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private subs: SubscriptionService
  ) { }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Subscription", url: "/subscription/plans" },
      { title: "Invoices", url: "/subscription/invoices" }
    ]);

    this.subs.permissions().subscribe(a => {
      if(a.plan.indexOf("shopify")==-1){
        this.hideStripePayments = true;
        this.noInvoiceMessage = "Log in to Shopify admin panel for your invocies";
      }
    });
  }

}
