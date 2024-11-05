// src/notifications/application/use-cases/sendNotification.ts
import { NotificationsRepository } from '../../domain/ports/NotificationsRepository';
import { Notifications } from '../../domain/entities/notifications';
import { NotificationId } from '../../domain/value-objects/notificationId';

export class SendNotification {
    constructor(
        private readonly notificationsRepository: NotificationsRepository,
        private readonly emailService: { send: (to: string, message: string) => Promise<void> }
    ) {}

    async execute(notificationData: { contactId: string; email: string; phoneNumber: string; subject: string; message: string }): Promise<void> {
        const notificationId = new NotificationId(); // Se genera un UUID internamente
        // Corrección de la línea donde se instancia la notificación
    const notification = new Notifications(
      notificationId, // Pasa el objeto NotificationId directamente
      notificationData.contactId,
      notificationData.email,
      notificationData.phoneNumber,
      new Date()
     );


        try {
            await this.emailService.send(notificationData.email, notificationData.message);
            notification.dateSent = new Date();
        } catch (error) {
            console.error('Failed to send notification:', error);
            throw new Error('Error sending notification');
        }

        await this.notificationsRepository.save(notification);
    }
}
