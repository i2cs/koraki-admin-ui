"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var applications_component_1 = require("./main/applications.component");
var new_application_component_1 = require("./new-application/new-application.component");
exports.ApplicationsRoutes = [
    {
        path: '',
        children: [{
                path: '',
                component: applications_component_1.ApplicationsComponent
            }, {
                path: 'new',
                component: new_application_component_1.NewApplicationComponent
            }]
    }
];
//# sourceMappingURL=applications.routing.js.map