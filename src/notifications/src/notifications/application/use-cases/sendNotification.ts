// sendNotification.ts
import { NotificationsRepository } from '../../domain/ports/NotificationsRepository';
import { Notifications } from '../../domain/entities/notifications';
import { NotificationId } from '../../domain/value-objects/notificationId';
import { EmailServicePort } from '../../domain/ports/EmailServicePort';
import { WhatsAppServicePort } from '../../domain/ports/WhatsAppServicePort';

export class SendNotification {
    constructor(
        private readonly notificationsRepository: NotificationsRepository,
        private readonly emailService: EmailServicePort,
        private readonly whatsappService: WhatsAppServicePort // Añadir el servicio de WhatsApp
    ) {}

    async execute(notificationData: { event: string; contactId: string; email: string; phoneNumber: string; amount?: number; approvalUrl?: string; notificationPreference: string }): Promise<void> {
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
            // Enviar la notificación según la preferencia
            if (notificationData.notificationPreference === 'whatsapp') {
                // Verificar que el número de teléfono esté definido para enviar por WhatsApp
                if (!notificationData.phoneNumber) {
                    throw new Error('No phone number defined for WhatsApp notification');
                }
                await this.whatsappService.send(notificationData.phoneNumber, message);
            } else if (notificationData.notificationPreference === 'email') {
                // Verificar que el correo esté definido para enviar por email
                if (!notificationData.email) {
                    throw new Error('No email address defined for email notification');
                }
                await this.emailService.send(notificationData.email, message);
            } else {
                throw new Error('Invalid notification preference');
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
