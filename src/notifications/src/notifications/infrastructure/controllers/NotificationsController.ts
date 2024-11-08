import { SendNotification } from '../../application/use-cases/sendNotification';
import { GenerateToken } from '../../../tokens/application/use-cases/generateToken';

export class NotificationsController {
    constructor(
        public sendNotification: SendNotification,
        public generateToken?: GenerateToken
    ) {}

    async handleNotification(event: string, payload: { email: string; contactId?: string; phoneNumber?: string; amount?: number; approvalUrl?: string }): Promise<void> {
        if (event === 'user.created' && this.generateToken) {
            try {
                await this.generateToken.execute(payload.contactId!, payload.phoneNumber!);
                console.log(`Token generado y enviado a ${payload.phoneNumber} para el evento ${event}`);
                return;
            } catch (error) {
                console.error(`Error al generar y enviar el token para ${event}:`, error);
                throw new Error('Error generating and sending token');
            }
        }

        await this.sendNotification.execute({
            event,
            contactId: payload.contactId || '',
            email: payload.email,
            phoneNumber: payload.phoneNumber || '',
            amount: payload.amount,
            approvalUrl: payload.approvalUrl,
        });
    }
}
