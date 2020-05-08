import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChange, DoCheck, KeyValueDiffers } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-notification-preview',
  templateUrl: './notification-preview.component.html',
  styleUrls: ['./notification-preview.component.scss']
})
export class NotificationPreviewComponent implements OnInit, OnChanges, DoCheck {
  @ViewChild('iframe') iframe: ElementRef;
  @ViewChild('liveiframe') liveiframe: ElementRef;
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
    this.liveiframe.nativeElement["src"] = this.url + '&sample={"variables": {"country_code":"lk"}, "number":23,"analytics": true, "notificationText":"Twenty three people from Sri Lanka are browsing this page", "createdOnWord": "Live" , "thumbnailUrl":""}';
  }

  refreshPreview(){
    this.iframe.nativeElement["src"] = this.url;
    this.liveiframe.nativeElement["src"] = this.url + '&sample={"variables": {"country_code":"lk"}, "number":23,"analytics": true, "notificationText":"Twenty three people from Sri Lanka are browsing this page", "createdOnWord": "Live" , "thumbnailUrl":""}';
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
