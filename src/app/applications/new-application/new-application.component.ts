// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ApplicationsService, ApplicationCreateDataModel, ApplicationViewDataModel } from 'koraki-angular-client';
import { Router } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';

declare const $: any;

@Component({
    selector: 'app-new',
    templateUrl: './new-application.component.html',
    styleUrls: ['./new-application.component.scss']
})

export class NewApplicationComponent implements OnInit {
    appCreatedResponse: ApplicationViewDataModel;
    appCreated: boolean;
    type: FormGroup;
    model: ApplicationCreateDataModel = <ApplicationCreateDataModel>{};
    constructor(
        private appservice: ApplicationsService,
        private formBuilder: FormBuilder,
        private router: Router,
        private loadingService: LoadingServiceService,
        public notify: NotificationService
    ) { }

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

        this.loadingService.loading(true);

        this.appservice.createApplication(this.model).subscribe(a => {
            this.loadingService.loading(false);
            if (!a.token) {
                this.notify.error("Could not create the application");

            } else {
                this.appCreated = true;
                this.appCreatedResponse = a;
                this.router.navigate(['applications/view', this.appCreatedResponse.id], { queryParams: { new: true } });
            }
        }, e => {
            this.loadingService.loading(false);
            this.notify.error("<b>" + e.error.message + "<br>" + e.error.errors.join("<br>"));
        });
    }

    ngOnInit() {
        this.type = this.formBuilder.group({
            appName: [null, [Validators.required]],
            url: [null, [Validators.required, Validators.pattern("^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$")]],
        });
    }
}
