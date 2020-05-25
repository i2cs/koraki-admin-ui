import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { ApplicationsComponent } from './main/applications.component';
import { ApplicationsRoutes } from './applications.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewApplicationComponent } from './new-application/new-application.component';
import { ViewApplicationComponent } from './view-application/view-application.component';
import { MomentModule } from 'ngx-moment';
import { ColorPickerModule } from 'ngx-color-picker';
import { AnalyticsViewComponent } from './analytics-view/analytics-view.component';
import { NotificationsViewComponent } from './notifications-view/notifications-view.component';
import { NotificationPreviewComponent } from './notification-preview/notification-preview.component';
import { WpContentRenderModule } from 'app/shared/wp-content-render/wp-content-render.module';

@NgModule({
  imports: [
    RouterModule.forChild(ApplicationsRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentModule,
    ColorPickerModule,
    WpContentRenderModule
  ],
  declarations: [ApplicationsComponent, NewApplicationComponent, ViewApplicationComponent, AnalyticsViewComponent, NotificationsViewComponent, NotificationPreviewComponent]
})
export class ApplicationsModule { }
