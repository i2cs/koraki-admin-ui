import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit() {
    this.breadcrumbService.show([
      { title: "Subscription", url: "/subscription/plans" },
      { title: "Invoices", url: "/subscription/invoices" }
    ]);
  }

}
