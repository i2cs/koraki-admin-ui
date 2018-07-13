import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumb = new Subject<any[]>();
  breadcrumb$ = this.breadcrumb.asObservable();
  
  constructor() { }

  show(items: any[]){
    this.breadcrumb.next(items);
  }
}
