import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
//import { NavItem, NavItemType } from '../../md/md.module';
import { Subscription } from 'rxjs/Subscription';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent, formatCurrency } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import PerfectScrollbar from 'perfect-scrollbar';
import { LoadingServiceService } from '../../services/loading-service.service';
import { NotificationService } from '../../services/notification.service';
import { SubscriptionService } from '../../services/subscription.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

declare const $: any;

@Component({
    selector: 'app-layout',
    templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
    @ViewChild('sidebar') sidebar: any;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    url: string;
    location: Location;
    loading: boolean;
    slow: boolean;
    plan: string;
    breadcrumb: any[];
    trialEndsIn: number;
    
    constructor(private router: Router,
        location: Location,
        loadingService: LoadingServiceService,
        private cdRef: ChangeDetectorRef,
        notification: NotificationService,
        breadcrumbService: BreadcrumbService,
        private subscription: SubscriptionService
    ) {
        this.location = location;

        loadingService.loading$.subscribe(a => this.loading = a);
        breadcrumbService.breadcrumb$.subscribe(a => this.breadcrumb = a);
        loadingService.slow$.subscribe(
            a => {
                if(!this.slow && a){
                    notification.warning("Slow network connection detected. We will keep trying!");
                }
                this.slow = a;
            }
        );
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnInit() {
        this.subscription.permissions().subscribe(a => {
            this.plan = a.planName + " (" + formatCurrency(a.cost, "en-US", "$") + ")";
            this.trialEndsIn = a.trialEndsIn;
        });

        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl)
                    this.yScrollStack.push(window.scrollY);
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                }
                else
                    window.scrollTo(0, 0);
            }
        });
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            elemMainPanel.scrollTop = 0;
            elemSidebar.scrollTop = 0;
        });
        const html = document.getElementsByTagName('html')[0];
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps = new PerfectScrollbar(elemMainPanel);
            ps = new PerfectScrollbar(elemSidebar);
            html.classList.add('perfect-scrollbar-on');
        }
        else {
            html.classList.add('perfect-scrollbar-off');
        }
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            this.navbar.sidebarClose();
        });
    }
    ngAfterViewInit() {
        this.runOnRouteChange();
    }
    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            let ps = new PerfectScrollbar(elemMainPanel);
            ps = new PerfectScrollbar(elemSidebar);
            ps.update();
        }
    }
    isMac(): boolean {
        return true;
        // let bool = false;
        // if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
        //     bool = true;
        // }
        // return bool;
    }
}
