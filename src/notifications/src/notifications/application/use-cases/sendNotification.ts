import { NotificationsRepository } from '../../domain/ports/NotificationsRepository';
import { Notifications } from '../../domain/entities/notifications';
import { v4 as uuidv4 } from 'uuid';

export class SendNotification {
    constructor(
        private readonly notificationsRepository: NotificationsRepository,
        private readonly emailService: { send: (to: string, message: string) => Promise<void> }
    ) {}

    async execute(notificationData: { contactId: string; email: string; phoneNumber: string; subject: string; message: string }): Promise<void> {
        const notification = new Notifications(
            uuidv4(), // Genera un ID único
            notificationData.contactId,
            notificationData.email,
            notificationData.phoneNumber, // Asegúrate de pasar el número de teléfono aquí
            new Date()
        );

        try {
            // Enviar notificación por correo electrónico
            await this.emailService.send(notificationData.email, notificationData.message);
            notification.dateSent = new Date(); // Actualiza la fecha de envío después de enviar
        } catch (error) {
            console.error('Failed to send notification:', error);
            throw new Error('Error sending notification');
        }

        // Guardar la notificación en el repositorio
        await this.notificationsRepository.save(notification);
    }
}
