import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { LoadingServiceService } from '../../services/loading-service.service';
import { PaymentService, PaymentCardDataViewModel, PaymentCardDataUpdateModel } from 'koraki-angular-client';
import { environment } from 'environments/environment';
import { NotificationService } from '../../services/notification.service';

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

  constructor(
    private notification: NotificationService,
    private paymentService: PaymentService,
    private breadcrumbService: BreadcrumbService,
    private loadingService: LoadingServiceService
  ) { }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Subscription", url: "/subscription" },
      { title: "Payment methods", url: "/subscription/cards" }
    ]);

    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    this.loadData();
  }

  loadData() {
    this.paymentService.getAllCards().subscribe(a => {
      this.cards = a;
      this.primary = a.filter(a => a.primary)[0].id;
    });
  }

  updateSource(e) {
    var model: PaymentCardDataUpdateModel = {
      primary: true
    };

    this.paymentService.setDefaultCard(this.primary, model).subscribe(a => {
      this.notification.success("Defualt card changed");
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
