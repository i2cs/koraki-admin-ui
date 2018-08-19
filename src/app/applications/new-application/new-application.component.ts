// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ApplicationsService, ApplicationCreateDataModel, ApplicationViewDataModel, SubscriptionsService } from 'koraki-angular-client';
import { Router } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { SubscriptionService } from '../../services/subscription.service';

declare const $: any;

@Component({
    selector: 'app-new',
    templateUrl: './new-application.component.html',
    styleUrls: ['./new-application.component.scss']
})

export class NewApplicationComponent implements OnInit, AfterViewInit {
    appCreatedResponse: ApplicationViewDataModel;
    appCreated: boolean;
    type: FormGroup;
    canAdd: boolean = true;
    model: ApplicationCreateDataModel = <ApplicationCreateDataModel>{};
    constructor(
        private appservice: ApplicationsService,
        private formBuilder: FormBuilder,
        private breadcrumbService: BreadcrumbService,
        private router: Router,
        private loadingService: LoadingServiceService,
        private subscriptionsService: SubscriptionsService,
        public notify: NotificationService
    ) { }

    ngAfterViewInit(){
    
    }

    isFieldValid(form: FormGroup, field: string) {
        return !form.get(field).valid && form.get(field).touched;
    }

    displayFieldCss(form: FormGroup, field: string) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field)
        };
    }

    createApp(): void {
        if (!this.type.valid) {
            return;
        }

        this.appservice.createApplication(this.model).subscribe(a => {
            if (!a.token) {
                this.notify.error("Could not create the application");
            } else {
                this.appCreated = true;
                this.appCreatedResponse = a;
                this.router.navigate(['applications/view', this.appCreatedResponse.id], { fragment: "new=true" });
            }
        }, e => {
            this.notify.error("<b>" + e.error.message);
        });
    }

    ngOnInit() {
        this.subscriptionsService.getPermissions().subscribe(b => {
            this.canAdd = b.canAddMoreApps;
          });

        this.breadcrumbService.show([
            { title: "Applications", url: "/applications" },
            { title: "New" }
        ]);

        this.type = this.formBuilder.group({
            appName: [null, [Validators.required]],
            url: [null, [Validators.required, Validators.pattern("^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$")]],
        });
    }
}
