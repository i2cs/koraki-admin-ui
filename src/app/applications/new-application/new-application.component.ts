// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ApplicationsService, ApplicationCreateDataModel, ApplicationViewDataModel, SubscriptionsService } from 'koraki-angular-client';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { environment } from 'environments/environment';

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
    showWelcome: boolean = false;
    background: boolean = false;
    appSelectorView: boolean;
    applications: ApplicationViewDataModel[];
    redirectUrl: string = "";
    constructor(
        private appservice: ApplicationsService,
        private formBuilder: FormBuilder,
        private breadcrumbService: BreadcrumbService,
        private router: Router,
        private loadingService: LoadingServiceService,
        private subscriptionsService: SubscriptionsService,
        public notify: NotificationService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngAfterViewInit() {
        this.subscriptionsService.getPermissions().subscribe(a => {
            if (a.email.startsWith("shopify|")) {
                window.location.href = environment.integrations.shopify.appInstallUrl;
            }
        });
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

        this.createApplication(false);
    }

    createApplication(redirect: any) {
        this.appservice.createApplication(this.model).subscribe(a => {
            if (!a.token) {
                this.notify.error("Could not create the application");
            } else {
                if (redirect) {
                    const redirectUrl = new URL(redirect);
                    redirectUrl.searchParams.append("client_id", a.clientId);
                    redirectUrl.searchParams.append("client_secret", a.clientSecret);
                    redirectUrl.searchParams.append("app_id", a.id.toString());
                    document.location.href = redirectUrl.href;
                } else {
                    this.notify.loadApplications.emit(true);
                    this.appCreated = true;
                    this.appCreatedResponse = a;
                    this.router.navigate(['applications/view', this.appCreatedResponse.id], { fragment: "new=true" });
                }
            }
        }, e => {
            this.notify.error("<b>" + e.error.message);
            if(redirect){
                document.location.href = '/subscription/add';
            }
        });
    }

    redirectToUrl(app: ApplicationViewDataModel){
        const redirectUrl = new URL(this.redirectUrl);
        redirectUrl.searchParams.append("client_id", app.clientId);
        redirectUrl.searchParams.append("client_secret", app.clientSecret);
        redirectUrl.searchParams.append("app_id", app.id.toString());

        window.location.href = redirectUrl.href;
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(a => {
            this.showWelcome = a['forced'];
            if (a['autocreate'] == "true" && a['url'] && a['name']) {
                this.background = true;
                this.redirectUrl = a['redirect']
                this.model.applicationName = a['name'] || "My First App";
                this.model.url = a['url'] || "localhost";

                this.appservice.getAllApplications().subscribe(x => {
                    if(x.totalRecordCount == 0){
                        this.createApplication(a['redirect']);
                    } else {
                        this.appSelectorView = true;
                        this.applications = x.items;
                    }
                });
            }
        });

        this.subscriptionsService.getPermissions().subscribe(b => {
            this.canAdd = b.canAddMoreApps;
        });

        this.breadcrumbService.show([
            { title: "Applications", url: "/applications" },
            { title: "New" }
        ]);

        this.type = this.formBuilder.group({
            appName: [null, [Validators.required]],
            url: [null, [Validators.required, Validators.pattern("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$")]],
        });
    }
}
