import { Injectable } from '@angular/core';
import { SubscriptionsService, SubscriptionsDataViewModel } from 'koraki-angular-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private _subscription = new Subject<SubscriptionsDataViewModel>();
  private _subscriptionsLoaded: boolean;
  private _subs: any;

  constructor(
    private subscriptionService: SubscriptionsService
  ) {
    this.loadSubscriptionData();
  }

  public permissions(): Observable<SubscriptionsDataViewModel> {
    if (!this._subscriptionsLoaded) {
      this.loadSubscriptionData();
      return this._subscription.asObservable();
    }else{
      return Observable.create((observer) => {  
        observer.next(this._subs); 
        observer.complete();
      });
    }
  }

  private loadSubscriptionData() {
    this.subscriptionService.getPermissions().subscribe(a => {
      this._subscription.next(a);
      this._subscription.complete();
      this._subs = a;
      this._subscriptionsLoaded = true;
    }, e => {

    })
  }
}
