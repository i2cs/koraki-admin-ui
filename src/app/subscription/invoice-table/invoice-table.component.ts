import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {
  invoices: any[];

  constructor() { }

  ngOnInit() {
    this.invoices = [];
  }

}
