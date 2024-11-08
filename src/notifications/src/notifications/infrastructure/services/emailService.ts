// src/notifications/infrastructure/services/emailService.ts
import nodemailer from 'nodemailer';
import { EmailServicePort } from '../../domain/ports/EmailServicePort';

export class EmailService implements EmailServicePort {
    private transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    async send(to: string, message: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: "Notifications <no-reply@example.com>",
                to,
                subject: "Notification",
                text: message,
            });
            console.log(`Correo enviado a ${to}`);
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            throw new Error("Error al enviar el correo");
        }
    }
}
