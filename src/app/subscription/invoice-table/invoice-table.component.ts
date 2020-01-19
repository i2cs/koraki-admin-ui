import { Component, OnInit } from '@angular/core';
import { InvoicesService } from 'koraki-angular-client';
import { formatCurrency } from '@angular/common';
import { SubscriptionService } from 'app/services/subscription.service';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {
  invoices: any[] = [];

  constructor(
    private invoiceService: InvoicesService
  ) { }

  ngOnInit() {
    this.invoiceService.getInvoicesList().subscribe(a => {
      this.invoices = a;
    }, e => {

    });
  }

  format(cost){
    return formatCurrency(cost / 100, "en-US", "$")
  }
}
