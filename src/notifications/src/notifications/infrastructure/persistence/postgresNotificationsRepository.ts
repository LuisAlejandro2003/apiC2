import { Pool } from 'pg';
import { Notifications } from '../../domain/entities/notifications';
import { NotificationsRepository } from '../../domain/ports/NotificationsRepository';

export class PostgresNotificationsRepository implements NotificationsRepository {
    constructor(private readonly db: Pool) {}

    async save(notification: Notifications): Promise<void> {
        await this.db.query(
            'INSERT INTO notifications (id_notification, contact_id, email, phone_number, date_sent) VALUES ($1, $2, $3, $4, $5)',
            [
                notification.idNotification,
                notification.contactId,
                notification.email,
                notification.phoneNumber,
                notification.dateSent || new Date()
            ]
        );
    }
}
