// src/notifications/application/use-cases/sendNotification.ts
import { NotificationsRepository } from '../../domain/ports/NotificationsRepository';
import { Notifications } from '../../domain/entities/notifications';
import { NotificationId } from '../../domain/value-objects/notificationId';
import { EmailServicePort } from '../../domain/ports/EmailServicePort';

export class SendNotification {
    constructor(
        private readonly notificationsRepository: NotificationsRepository,
        private readonly emailService: EmailServicePort
    ) {}

    async execute(notificationData: { event: string; contactId: string; email: string; phoneNumber: string; amount?: number; approvalUrl?: string }): Promise<void> {
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
            await this.emailService.send(notificationData.email, message);
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
