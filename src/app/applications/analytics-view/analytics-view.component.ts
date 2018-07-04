import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-analytics-view',
  templateUrl: './analytics-view.component.html',
  styleUrls: ['./analytics-view.component.scss']
})
export class AnalyticsViewComponent implements OnInit {

  piwikUrl: string = environment.analytics;
  widgets: object[] = [];

  @Input() analyticsid: string;
  @Input() analyticstoken: string;

  constructor(private sanitizer: DomSanitizer) { 

    this.widgets.push({
      url : this.addTokenAuthAndSiteId("/index.php?module=Widgetize&action=iframe&widget=1&moduleToWidgetize=Live&actionToWidgetize=getSimpleLastVisitCount&period=day&date=yesterday&disableLink=1&widget=1"),
      class : "col-md-6"
    });

    this.widgets.push({
      url : this.addTokenAuthAndSiteId("/index.php?module=Widgetize&action=iframe&widget=1&moduleToWidgetize=UserCountry&actionToWidgetize=getCity&period=day&date=yesterday&disableLink=1&widget=1"),
      class : "col-md-6"
    });

    this.widgets.push({
      url : this.addTokenAuthAndSiteId("/index.php?module=Widgetize&action=iframe&widget=1&moduleToWidgetize=UserCountryMap&actionToWidgetize=realtimeMap&period=day&date=yesterday&disableLink=1&widget=1"),
      class : "col-md-12"
    });

    this.widgets.push({
      url : this.addTokenAuthAndSiteId("/index.php?module=Widgetize&action=iframe&widget=1&moduleToWidgetize=Actions&actionToWidgetize=getPageTitles&period=day&date=yesterday&disableLink=1&widget=1"),
      class : "col-md-12"
    });
  }

  ngOnInit() {
    if(!this.analyticsid || !this.analyticstoken){
      alert("error");
    }
  }

  addTokenAuthAndSiteId(url: string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.piwikUrl + url + "&idSite=" + this.analyticsid + "&token_auth=" + this.analyticstoken);
  }

  trackByFn(index, item) {
    return item.url;
  }
}
