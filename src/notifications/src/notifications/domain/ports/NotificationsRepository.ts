import { Notifications } from '../entities/notifications';

export interface NotificationsRepository {
    save(notification: Notifications): Promise<void>;
}
