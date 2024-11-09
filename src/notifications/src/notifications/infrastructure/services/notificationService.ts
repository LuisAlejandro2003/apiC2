// notificationService.ts
import { EmailServicePort } from '../../domain/ports/EmailServicePort';
import { WhatsAppServicePort } from '../../domain/ports/WhatsAppServicePort'; 
import { NotificationsRepository } from '../../domain/ports/NotificationsRepository';
import { Notifications } from '../../domain/entities/notifications';
import { NotificationId } from '../../domain/value-objects/notificationId';

export class NotificationService {
    constructor(
        private readonly emailService: EmailServicePort,
        private readonly whatsappService: WhatsAppServicePort,
        private readonly notificationsRepository: NotificationsRepository
    ) {}

    async send(notificationData: { event: string; contactId: string; email: string; phoneNumber: string; amount?: number; approvalUrl?: string; notificationPreference: string }): Promise<void> {
        const message = this.buildMessage(notificationData);
        const notificationId = new NotificationId();

        const notification = new Notifications(
            notificationId,
            notificationData.contactId,
            notificationData.email,
            notificationData.phoneNumber,
            new Date()
        );

        try {
            if (notificationData.notificationPreference === 'whatsapp') {
                await this.whatsappService.send(notificationData.phoneNumber, message);
            } else {
                await this.emailService.send(notificationData.email, message);
            }
            notification.dateSent = new Date();
        } catch (error) {
            console.error('Failed to send notification:', error);
            throw new Error('Error sending notification');
        }

        await this.notificationsRepository.save(notification);
    }

    private buildMessage(data: { event: string; contactId: string; email: string; phoneNumber: string; amount?: number; approvalUrl?: string }): string {
        switch (data.event) {
            case 'contact.created':
                return `Hola, tu contacto ha sido registrado correctamente con el número: ${data.phoneNumber}, ¡Bienvenido!`;
            case 'payments.created':
                return `Has realizado una orden de ${data.amount} USD. Por favor confirma tu pago en el siguiente enlace: ${data.approvalUrl}`;
            default:
                return 'Notificación genérica';
        }
    }
}
