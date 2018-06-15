"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./applications.service"));
var applications_service_1 = require("./applications.service");
__export(require("./notifications.service"));
var notifications_service_1 = require("./notifications.service");
exports.APIS = [applications_service_1.ApplicationsService, notifications_service_1.NotificationsService];
//# sourceMappingURL=api.js.map