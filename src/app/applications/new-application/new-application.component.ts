// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ApplicationsService, ApplicationCreateDataModel, ApplicationViewDataModel } from 'koraki-angular-client';
import { Router } from '@angular/router';

declare const $: any;

@Component({
    selector: 'app-new',
    templateUrl: './new-application.component.html',
    styleUrls: ['./new-application.component.scss']
})

export class NewApplicationComponent implements OnInit {
    appCreatedResponse: ApplicationViewDataModel;
    appCreated: boolean;
    creatingApp: boolean;
    type: FormGroup;
    model: ApplicationCreateDataModel = <ApplicationCreateDataModel>{};
    constructor(
        private appservice: ApplicationsService,
        private formBuilder: FormBuilder,
        private router: Router
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

        this.creatingApp = true;

        this.appservice.createApplication(this.model).subscribe(a => {
            this.creatingApp = false;
            if (!a.token) {
                $.notify({
                    icon: "add_alert",
                    message: "Could not create the application"
                }, {
                        type: 'error',
                        timer: 4000,
                        placement: {
                            from: "top",
                            align: "right"
                        }
                    }
                );
            } else {
                this.appCreated = true;
                this.appCreatedResponse = a;
                this.router.navigate(['applications/view', this.appCreatedResponse.id], { queryParams: { new: true } });
            }
        }, e => {
            this.creatingApp = false;
            $.notify({
                icon: "add_alert",
                message: "<b>" + e.error.message + "<br>" + e.error.errors.join("<br>")
            }, {
                    type: 'danger',
                    timer: 4000,
                    placement: {
                        from: "top",
                        align: "right"
                    }
                }
            );
        });
    }

    ngOnInit() {
        this.type = this.formBuilder.group({
            appName: [null, [Validators.required]],
            url: [null, [Validators.required, Validators.pattern("^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$")]],
        });
    }
}
