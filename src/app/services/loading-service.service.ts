import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  private _loading = new Subject<boolean>();
  loading$ = this._loading.asObservable();
  
  loading(loading: boolean) {
    this._loading.next(loading);
  }
}
