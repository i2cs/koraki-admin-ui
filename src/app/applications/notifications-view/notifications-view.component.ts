import { Component, OnInit, Input } from '@angular/core';
import { NotificationsService, NotificationViewDataModel } from 'koraki-angular-client';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view.component.html',
  styleUrls: ['./notifications-view.component.scss']
})
export class NotificationsViewComponent implements OnInit {
  @Input() appId: string;
  notificationsList: any[] = Array();
  table: Array<NotificationViewDataModel> = [];

  constructor(
    private notifications: NotificationsService
  ) { }

  ngOnInit() {
    this.loadNotifications();
  }

  ngAfterViewInit() {
    
  }

  loadNotifications() {
    this.notifications.getAllNotifications(["Ready"], 999, null, this.appId).subscribe(a => {
      this.table = a.items.filter(a => a.status == "Ready");
    })
  }
}
