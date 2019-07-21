import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChange, DoCheck, KeyValueDiffers } from '@angular/core';
import { environment } from 'environments/environment';
import { ApplicationViewDataModel, ApplicationsService } from 'koraki-angular-client';

@Component({
  selector: 'app-notification-preview',
  templateUrl: './notification-preview.component.html',
  styleUrls: ['./notification-preview.component.scss']
})
export class NotificationPreviewComponent implements OnInit, OnChanges, DoCheck {
  @ViewChild('iframe') iframe: ElementRef;
  @Input() appId: string;
  @Input() configs: any;
  differ: any;

  url: string;
  constructor(
    private differs: KeyValueDiffers
  ) { 
    this.differ = differs.find({}).create();
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  }
  
  ngDoCheck() {
    var changes = this.differ.diff(this.configs);
    if (changes) {
      this.updatePreview();
    }
  }

  ngOnInit() {
    this.load();
  }

  updatePreview(){
    this.load();  
  }

  load(){
    let q = this.serialize(this.configs);
    this.url = environment.apiBaseUrl + "/widget.html?demo=true&_i=&" + q;
    this.iframe.nativeElement["src"] = this.url;
  }

  refreshPreview(){
    this.iframe.nativeElement["src"] = this.url;
  }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
}
