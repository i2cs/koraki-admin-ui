import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingServiceService } from '../../services/loading-service.service';
import { Router } from '@angular/router';
import { AddCardComponent } from '../add-card/add-card.component';
import { NotificationService } from '../../services/notification.service';
import { PaymentService, PaymentCardDataCreateModel } from 'koraki-angular-client';

@Component({
  selector: 'app-create-payment-method',
  templateUrl: './create-payment-method.component.html',
  styleUrls: ['./create-payment-method.component.scss']
})
export class CreatePaymentMethodComponent implements OnInit {

  @ViewChild(AddCardComponent) card: AddCardComponent;
  form: any = {};
  loading: boolean;
  constructor(
    private notification: NotificationService,
    private loadingService: LoadingServiceService,
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe(a => { this.loading = a; });
  }

  addCard() {
    const name = this.form['name'];
    const address_line1 = this.form['address'];
    const address_city = this.form['city'];
    const address_state = this.form['state'];
    const address_country = this.form['country'];

    if (name && address_line1 && address_city && address_state && address_country) {
      this.card.getToken().subscribe(result => {
        this.notification.success("Please wait");
        if (result.token && result.token.card) {
          let model: PaymentCardDataCreateModel = { token : result.token.id }
          this.paymentService.createCardByToken(model).subscribe(a => {
            this.notification.success("New card added");
            this.router.navigate(['/subscription/cards']);
          }, e => {
            this.notification.error(e.error.message);
          });
        }
      });
    }
  }
}
