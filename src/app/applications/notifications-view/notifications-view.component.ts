import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { NotificationsService, NotificationViewDataModel, NotificationCreateDataModel } from 'koraki-angular-client';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'app/services/loading-service.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view.component.html',
  styleUrls: ['./notifications-view.component.scss']
})
export class NotificationsViewComponent implements OnInit {
  @Input() appId: string;
  @Input() reloadNotifications: EventEmitter<boolean>;
  notificationsList: any[] = Array();
  table: Array<NotificationViewDataModel> = [];
  loaded: boolean;
  loading: boolean;
  loadingSubscription: Subscription;

  constructor(
    private notifications: NotificationsService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadingSubscription = this.loadingService.loading$.subscribe(a => { this.loading = a; });
    this.reloadNotifications.subscribe(a => {
      if(a){
        this.loadNotifications();
      }
    })
  }

  ngAfterViewInit() {

  }

  integrationsTab() {
    this.router.navigate(['/applications/view/' + this.appId + '/integrations']);
  }

  loadNotifications() {
    this.notifications.getAllNotifications(["Ready"], 999, null, this.appId).subscribe(a => {
      this.table = a.items.filter(a => a.status == "Ready");
      this.loaded = true;
    });
  }

  remove(id) {
    var confirmed = confirm("Are you sure you want to remove this notification?");
    if (confirmed) {
      this.notifications.deleteNotification(id, this.appId).subscribe(a => {
        this.notify.success("Successfully removed");
        this.loadNotifications();
      })
    }
  }

  isLocalizedNotification(text) {
    return text.match("^{(.+:[^,]+)+}$");
  }

  parse(json) {
    var arr = [];
    var object = JSON.parse(json);
    var keys = Object.keys(object);
    for(var i in keys){
      arr.push({ key : keys[i], value : object[keys[i]]});
    }
    return arr;
  }

  getIntegrationName(item: NotificationViewDataModel){
    if(item.variables){
      return item.variables['integration'];
    }
  }

  navigateToIntegration(integration){
    this.router.navigate(["/applications/view/" + this.appId + "/integrations/" + integration]);
  }

  trackByFn(index, item) {
    return item;
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
