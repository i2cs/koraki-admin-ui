import { Component, OnInit, Input } from '@angular/core';
import { NotificationsService, NotificationViewDataModel, NotificationCreateDataModel } from 'koraki-angular-client';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view.component.html',
  styleUrls: ['./notifications-view.component.scss']
})
export class NotificationsViewComponent implements OnInit {
  @Input() appId: string;
  notificationsList: any[] = Array();
  table: Array<NotificationViewDataModel> = [];
  loaded: boolean;

  constructor(
    private notifications: NotificationsService,
    private notify: NotificationService,
  ) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {

  }

  loadNotifications() {
    this.notifications.getAllNotifications(["Ready"], 999, null, this.appId).subscribe(a => {
      this.table = a.items.filter(a => a.status == "Ready");
      this.loaded = true;
    })
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
}
