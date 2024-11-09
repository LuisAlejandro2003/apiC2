// src/notifications/infrastructure/services/whatsappService.ts
import { WhatsAppServicePort } from '../../domain/ports/WhatsAppServicePort';
import twilio from 'twilio';

export class WhatsAppService implements WhatsAppServicePort {
    private client;

    constructor() {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    async send(to: string, message: string): Promise<void> {
        try {
            const formattedPhoneNumber = `whatsapp:+521${to}`;
            await this.client.messages.create({
                body: message,
                from: process.env.TWILIO_WHATSAPP_FROM,
                to: formattedPhoneNumber
            });
            console.log(`Mensaje de WhatsApp enviado a ${formattedPhoneNumber}`);
        } catch (error) {
            console.error(`Error al enviar el mensaje de WhatsApp a ${to}:`, error);
            throw new Error('Error enviando el mensaje de WhatsApp');
        }
    }
}
