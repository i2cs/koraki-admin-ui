import { Injectable } from '@angular/core';
import { SubscriptionsService, SubscriptionsDataViewModel } from 'koraki-angular-client';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private _subscription = new Subject<SubscriptionsDataViewModel>();
  private _subscriptionsLoaded: boolean;
  private _subs: any;

  constructor(
    private subscriptionService: SubscriptionsService,
    private auth: AuthService
  ) {
    this.loadSubscriptionData();
  }

  public clear(){
    this._subscriptionsLoaded = false;
  }

  public permissions(): Observable<SubscriptionsDataViewModel> {
    if(this.auth.isAuthenticated()){
      if (!this._subscriptionsLoaded) {
        this.loadSubscriptionData();
        return this._subscription.asObservable();
      }else{
        return Observable.create((observer) => {  
          observer.next(this._subs); 
        });
      }
    }

    return Observable.throw(new Error("Not authenticated"));
  }

  private loadSubscriptionData() {
    this.subscriptionService.getPermissions().subscribe(a => {
      this._subscription.next(a);
      this._subs = a;
      this._subscriptionsLoaded = true;
    }, e => {

    })
  }
}
