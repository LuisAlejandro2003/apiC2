import nodemailer from 'nodemailer';

export class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    async send(to: string, message: string): Promise<void> {
        await this.transporter.sendMail({
            from: '"Notifications" <no-reply@example.com>',
            to,
            subject: 'Notification',
            text: message
        });
    }
}
