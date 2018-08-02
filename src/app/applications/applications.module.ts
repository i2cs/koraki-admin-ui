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
import { AnalyticsViewComponent } from './analytics-view/analytics-view.component';
import { NotificationsViewComponent } from './notifications-view/notifications-view.component';

@NgModule({
  imports: [
    RouterModule.forChild(ApplicationsRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentModule
  ],
  declarations: [ApplicationsComponent, NewApplicationComponent, ViewApplicationComponent, AnalyticsViewComponent, NotificationsViewComponent]
})
export class ApplicationsModule { }
