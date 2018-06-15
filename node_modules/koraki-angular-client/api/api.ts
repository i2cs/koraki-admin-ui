export * from './applications.service';
import { ApplicationsService } from './applications.service';
export * from './notifications.service';
import { NotificationsService } from './notifications.service';
export const APIS = [ApplicationsService, NotificationsService];
