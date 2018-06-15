"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin_layout_component_1 = require("./layouts/admin/admin-layout.component");
exports.AppRoutes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }, {
        path: '',
        component: admin_layout_component_1.AdminLayoutComponent,
        children: [{
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            }, {
                path: 'applications',
                loadChildren: './applications/applications.module#ApplicationsModule'
            }
        ]
    }
];
//# sourceMappingURL=app.routing.js.map