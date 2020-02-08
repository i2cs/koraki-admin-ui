import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { LoadingServiceService } from '../../services/loading-service.service';
import { PaymentService, PaymentCardDataViewModel, PaymentCardDataUpdateModel } from 'koraki-angular-client';
import { environment } from 'environments/environment';
import { NotificationService } from '../../services/notification.service';
import { SubscriptionService } from 'app/services/subscription.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  loading: boolean;
  cards: PaymentCardDataViewModel[] = [];
  cardUrl: string = environment.ccIconPath;
  primary: string;
  noInvoiceMessage: string;
  hideStripePayments: boolean;

  constructor(
    private notification: NotificationService,
    private paymentService: PaymentService,
    private breadcrumbService: BreadcrumbService,
    private loadingService: LoadingServiceService,
    private subs: SubscriptionService
  ) { }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Subscription", url: "/subscription/plans" },
      { title: "Payment methods", url: "/subscription/cards" }
    ]);

    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    this.loadData();

    this.subs.permissions().subscribe(a => {
      if(a.email.startsWith("shopify|")){
        this.hideStripePayments = true;
        this.noInvoiceMessage = "Log in to Shopify admin panel for your payment methods";
      }
    });
  }

  loadData() {
    this.paymentService.getAllCards().subscribe(a => {
      this.cards = a;
      let x = a.filter(a => a.primary);
      if(x.length > 0)
        this.primary = x[0].id;
    });
  }

  updateSource(e) {
    var model: PaymentCardDataUpdateModel = {
      primary: true
    };

    this.paymentService.setDefaultCard(this.primary, model).subscribe(a => {
      this.notification.success("Primary card changed");
      this.loadData();
    });
  }

  delete(id, ending) {
    var confirmed = confirm("Are you sure you want to delete the card ending with " + ending);

    if (confirmed) {
      this.paymentService.deleteCard(id).subscribe(a => {
        this.notification.success("Payment method deleted");
        this.loadData();
      }, e => {
        this.notification.error(e.error.message);
      })
    }
  }
}
