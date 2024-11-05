// src/notifications/domain/entities/notifications.ts

import { NotificationId } from '../value-objects/notificationId';

export class Notifications {
    constructor(
        public idNotification: NotificationId,
        public contactId: string,
        public email: string,
        public phoneNumber: string,
        public dateSent: Date = new Date()
    ) {}
}
