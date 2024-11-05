import { SendNotification } from '../../application/use-cases/sendNotification';
import { GenerateToken } from '../../../tokens/application/use-cases/generateToken';

export class NotificationsController {
    constructor(
        private sendNotification: SendNotification,
        private generateToken?: GenerateToken // Añadimos la dependencia opcional
    ) {}

    async handleNotification(event: string, payload: { email: string; contactId: string; phoneNumber: string }): Promise<void> {
        if (event === 'user.created') {
            // Genera y envía un token en lugar de una notificación por correo
            if (this.generateToken) {
                try {
                    await this.generateToken.execute(payload.contactId, payload.phoneNumber);
                    console.log(`Token generado y enviado a ${payload.phoneNumber} para el evento ${event}`);
                    return; // No necesita enviar un mensaje adicional
                } catch (error) {
                    console.error(`Error al generar y enviar el token para ${event}:`, error);
                    throw new Error('Error generating and sending token');
                }
            }
        }

        let message = '';

        if (event === 'contact.created') {
            if (!payload.contactId) {
                throw new Error('Contact ID is required.');
            }
            message = `Hola, tu contacto ha sido registrado correctamente con el número: ${payload.phoneNumber}.`;
        }

        try {
            await this.sendNotification.execute({
                contactId: payload.contactId,
                email: payload.email,
                phoneNumber: payload.phoneNumber,
                subject: `Notificación de ${event}`,
                message: message
            });
        } catch (error) {
            console.error(`Error al enviar la notificación para el evento ${event}:`, error);
            throw new Error('Error sending notification');
        }
    }
}
