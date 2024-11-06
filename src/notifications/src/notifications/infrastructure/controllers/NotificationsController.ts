import { SendNotification } from '../../application/use-cases/sendNotification';
import { GenerateToken } from '../../../tokens/application/use-cases/generateToken';

export class NotificationsController {
    constructor(
        public sendNotification: SendNotification,
        public generateToken?: GenerateToken // Añadimos la dependencia opcional
    ) {}

  async handleNotification(event: string, payload: { email: string; contactId?: string; phoneNumber?: string; amount?: number; approvalUrl?: string }): Promise<void> {
    let message = '';

    if (event === 'user.created' && this.generateToken) {
        // Genera y envía un token
        try {
            await this.generateToken.execute(payload.contactId!, payload.phoneNumber!);
            console.log(`Token generado y enviado a ${payload.phoneNumber} para el evento ${event}`);
            return; // No necesita enviar un mensaje adicional
        } catch (error) {
            console.error(`Error al generar y enviar el token para ${event}:`, error);
            throw new Error('Error generating and sending token');
        }
    }

    if (event === 'contact.created') {
        if (!payload.contactId) {
            throw new Error('Contact ID is required.');
        }
        message = `Hola, tu contacto ha sido registrado correctamente con el número: ${payload.phoneNumber}.`;
    } else if (event === 'payments.created') {
        // Nueva lógica para el evento de pago
        if (!payload.email || !payload.amount || !payload.approvalUrl) {
            throw new Error('Email, amount, and approval URL are required for payment notifications.');
        }
        // Construcción del mensaje para payment.created
        message = `Has realizado un pago de ${payload.amount} USD. Por favor confirma tu pago en el siguiente enlace: ${payload.approvalUrl}`;
        console.log(`Mensaje generado para payments.created: ${message}`);
    }

    try {
        await this.sendNotification.execute({
            contactId: payload.contactId || '', // Valor por defecto si es undefined
            email: payload.email,
            phoneNumber: payload.phoneNumber || '', // Valor por defecto si es undefined
            subject: `Notificación de ${event}`,
            message: message
        });
        
        console.log(`Notificación enviada para el evento ${event} a ${payload.email} con el mensaje: ${message}`);
    } catch (error) {
        console.error(`Error al enviar la notificación para el evento ${event}:`, error);
        throw new Error('Error sending notification');
    }
}

}
