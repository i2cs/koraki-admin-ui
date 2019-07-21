import { Injectable, HostListener } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  private _lastChange : number;
  private _count: number = 0;
  private _loading = new Subject<boolean>();
  private _slow = new Subject<boolean>();
  loading$ = this._loading.asObservable();
  slow$ = this._slow.asObservable();

  constructor(){
    setInterval(a => {
      if(Date.now() - this._lastChange > 60000 && this._count > 0){
        this._count = 0;
        this._loading.next(false);
        console.error("60 seconds passed since last request. Probably offline");
      }

      if(Date.now() - this._lastChange > 10000 && this._count > 0){
        this._slow.next(true);
        console.error("5 seconds passed since last request. Slow network connection");
      }

      if(this._count == 0){
        this._slow.next(false);
      }
    }, 1000);
  }
  
  loading(loading: boolean) {
    this._lastChange = Date.now();
    loading?this._count++:(this._count==0?0:this._count--);
    this._loading.next(this._count > 0);
  }
}
