import { Component, OnInit, Input } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from '../services/auth.service';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    icontype: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
    path: '/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'dashboard'
}, {
    path: '/applications',
    title: 'Applications',
    type: 'link',
    icontype: 'cloud_queue'

}, {
    path: '/subscription',
    title: 'Subscription',
    type: 'sub',
    icontype: 'subscriptions',
    collapse: 'subscription',
    children: [
        {path: 'plans', title: 'Plan', icontype:'table_chart'},
        {path: 'cards', title: 'Payment Methods', icontype:'credit_card'},
        {path: 'invoices', title: 'Invoices', icontype:'subtitles'}
    ]
}, {
    path: 'https://koraki.freshdesk.com/support/tickets/new',
    title: 'Report an Issue',
    type: 'outlink',
    icontype: 'live_help'
}
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    @Input() plan: string;
    @Input() email: string;
    @Input() trialEndsIn: number;

    constructor(private auth: AuthService) { }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    logout() {
        this.auth.logout()
    }
}
