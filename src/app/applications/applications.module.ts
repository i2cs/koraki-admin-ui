import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { ApplicationsComponent } from './main/applications.component';
import { ApplicationsRoutes } from './applications.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewApplicationComponent } from './new-application/new-application.component';
import { ViewApplicationComponent } from './view-application/view-application.component';

@NgModule({
  imports: [
    RouterModule.forChild(ApplicationsRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [ApplicationsComponent, NewApplicationComponent, ViewApplicationComponent]
})
export class ApplicationsModule { }
