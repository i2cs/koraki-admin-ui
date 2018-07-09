import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opencart',
  templateUrl: './opencart.component.html',
  styleUrls: ['./opencart.component.scss']
})
export class OpencartComponent implements OnInit {
  releases:any[] = [];
  constructor() { }

  ngOnInit() {
    this.releases.push({
      name: "OpenCart 2.2.x",
      url: "https://github.com/i2cs/koraki-opencart-integration/archive/OC-2.2-v1.0.zip"
    });

    this.releases.push({
      name: "OpenCart 2.3.x",
      url: "https://github.com/i2cs/koraki-opencart-integration/archive/OC-2.3-v1.0.zip"
    });
  }

}
