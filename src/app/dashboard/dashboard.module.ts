import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { DashboardRoutes } from './dashboard.routing';
import { DashboardComponent } from './main/dashboard.component';
import { AppCountComponent } from './widgets/app-count/app-count.component';
import { NotificationCountComponent } from './widgets/notification-count/notification-count.component';
import { TotalViewsComponent } from './widgets/total-views/total-views.component';
import { LastActivityComponent } from './widgets/last-activity/last-activity.component';
import { MomentModule } from 'ngx-moment';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MaterialModule,
        MomentModule
    ],
    declarations: [DashboardComponent, AppCountComponent, NotificationCountComponent, TotalViewsComponent, LastActivityComponent]
})

export class DashboardModule {}
