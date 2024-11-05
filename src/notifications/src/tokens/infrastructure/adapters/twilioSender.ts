import twilio from 'twilio';

export class TwilioSender {
    private client;

    constructor() {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    async sendToken(phoneNumber: string, token: string): Promise<void> {
        try {
            const formattedPhoneNumber = `whatsapp:${phoneNumber}`;
            await this.client.messages.create({
                body: `Tu código de verificación es: ${token}`,
                from: process.env.TWILIO_WHATSAPP_FROM, // Debe ser 'whatsapp:+14155238886'
                to: formattedPhoneNumber // Incluye 'whatsapp:' para asegurarte de que es del mismo canal
            });
            console.log(`Token enviado a ${formattedPhoneNumber}`);
        } catch (error) {
            console.error(`Error al enviar el token a ${phoneNumber}:`, error);
            throw new Error('Error enviando el token con Twilio');
        }
    }
}
