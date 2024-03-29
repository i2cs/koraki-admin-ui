import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { SubscriptionService } from 'app/services/subscription.service';
import { LoadingServiceService } from 'app/services/loading-service.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  noInvoiceMessage: string;
  hideStripePayments: boolean;
  loading: boolean;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private subs: SubscriptionService,
    private loadingService: LoadingServiceService
  ) { }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Subscription", url: "/subscription/plans" },
      { title: "Invoices", url: "/subscription/invoices" }
    ]);

    this.subs.permissions().subscribe(a => {
      if(a.email.startsWith("shopify|")){
        this.hideStripePayments = true;
        this.noInvoiceMessage = "Log in to Shopify admin panel for your invocies";
      }
    });

    this.loadingService.loading$.subscribe(a => { this.loading = a; });
  }

}
