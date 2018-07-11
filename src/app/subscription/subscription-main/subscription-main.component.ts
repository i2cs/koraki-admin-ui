import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";
import { SubscriptionsService, SubscriptionCreateDataViewModel } from 'koraki-angular-client';
import { LoadingServiceService } from '../../services/loading-service.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-subscription-main',
  templateUrl: './subscription-main.component.html',
  styleUrls: ['./subscription-main.component.scss']
})
export class SubscriptionMainComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private subscriptions: SubscriptionsService,
    private loadingService: LoadingServiceService,
    private subs: SubscriptionService
  ) { }

  ngOnInit() {
    
  }
}
