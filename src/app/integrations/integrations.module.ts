import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookComponent } from './facebook/facebook.component';
import { RouterModule } from '@angular/router';
import { IntegrationsRoutes } from './integrations.routing';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    RouterModule.forChild(IntegrationsRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [FacebookComponent, MainComponent]
})
export class IntegrationsModule { }
