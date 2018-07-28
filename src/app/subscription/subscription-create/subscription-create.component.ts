import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { SubscriptionsService, SubscriptionCreateDataViewModel, AjaxService, PaymentService, SubscriptionNewCardModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { SubscriptionService } from '../../services/subscription.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AddCardComponent } from '../add-card/add-card.component';

@Component({
  selector: 'app-subscription-create',
  templateUrl: './subscription-create.component.html',
  styleUrls: ['./subscription-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SubscriptionCreateComponent implements OnInit {
  @ViewChild(AddCardComponent) card: AddCardComponent;
  loading: boolean;
  planIcons = environment.planIcons;
  cardUrl: string = environment.ccIconPath;
  plans: any[] = [];
  sources: any[] = [];
  planFeatures: any = {};
  form: any = { plan: { code: "" } };
  newSource: boolean;

  constructor(
    private notification: NotificationService,
    private subscriptions: SubscriptionsService,
    private breadcrumbService: BreadcrumbService,
    private paymentService: PaymentService,
    private ajax: AjaxService,
    private loadingService: LoadingServiceService,
    private subs: SubscriptionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Subscription", url: "/subscription" },
      { title: "New" }
    ]);

    this.loadingService.loading$.subscribe(a => { this.loading = a; });
    this.ajax.getAllSubscriptions().subscribe(a => {
      this.plans = a.filter(b => b.code != "free");

      this.subs.permissions().subscribe(b => {
        this.plans = this.plans.filter(c => c.code != b.plan);
        this.form['plan'] = this.plans[0];
        this.planFeatures = environment.plans;
      });
    });

    this.sources.push({ id: "new", name: "Add new card" });

    this.paymentService.getAllCards().subscribe(a => {
      a.forEach(b => {
        this.sources.unshift({ id: b.id, name: "<img src='" + this.cardUrl + b.brand + ".png' /> " + b.brand + " " + b.funding + " card ending with " + b.last4 });
      })
    });
  }

  subscribe() {
    const plan = this.form['plan'];
    const name = this.form['name'];
    const address_line1 = this.form['address'];
    const address_city = this.form['city'];
    const address_state = this.form['state'];
    const address_zip = this.form['zip'];
    const address_country = this.form['country'];

    if (this.form['source'] != "new") {
      this.subscriptions.subscribe(<SubscriptionCreateDataViewModel>{
        cardId : this.form['source'],
        subscriptionCode: plan['code']
      }).subscribe(a => {
        this.subs.clear();
        this.notification.success("Subscribed to " + plan.name);
        this.router.navigate(['/subscription/plans']);
      });
    } else {
      if (name && address_line1 && address_city && address_state && address_country) {
        this.card.getToken().subscribe(result => {
          this.notification.success("Please wait");
          if (result.token && result.token.card) {
            let card = <SubscriptionNewCardModel>{
              name: name,
              address: address_line1,
              city: address_city,
              state: address_state,
              zip: address_zip,
              country: address_country,
              cardId: result.token.card.id,
              token: result.token.id,
              last4: result.token.card.last4,
              expYear: result.token.card.exp_year,
              expMonth: result.token.card.exp_month,
              subscriptionCode: plan.code
            }

            this.subscriptions.subscribe(<SubscriptionCreateDataViewModel>{
              card: card,
              subscriptionCode: plan['code']
            }).subscribe(a => {
              this.subs.clear();
              this.notification.success("Subscribed to " + plan.name);
              this.router.navigate(['/subscription/plans']);
            });

            console.log(result);
          } else if (result.error) {
            this.notification.success("Error returned from payment gateway. Please choose another card");
            console.log(result.error.message);
          }
        });
      }
    }
  }
}
