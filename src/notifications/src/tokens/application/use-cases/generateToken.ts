// generateToken.ts
import { TokenRepository } from '../../domain/ports/tokenRepository';
import { TokenSender } from '../../domain/ports/tokenSender';
import { Token } from '../../domain/entities/token';
import { TokenId } from '../../domain/value-objects/tokenId';
import { NotificationId } from '../../../notifications/domain/value-objects/notificationId';
import { EmailServicePort } from '../../../notifications/domain/ports/EmailServicePort';
import { v4 as uuidv4 } from 'uuid';

export class GenerateToken {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly tokenSender: TokenSender,
        private readonly emailService: EmailServicePort
    ) {}

    async execute(contactId: string, phoneNumber: string, email: string, notificationPreference: string): Promise<void> {
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const notificationId = new NotificationId(uuidv4());
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 23);

        const token = new Token(
            new TokenId(uuidv4()),
            tokenValue,
            contactId,
            new Date(),
            expiration,
            notificationId.id
        );

        // Guardar el token en el repositorio
        await this.tokenRepository.saveToken(token);

        // Enviar el token según la preferencia de notificación
        if (notificationPreference === 'whatsapp') {
            await this.tokenSender.sendToken(`+521${phoneNumber}`, tokenValue);
        } else if (notificationPreference === 'email') {
            await this.emailService.send(email, `Your verification token is: ${tokenValue}`);
        } else {
            throw new Error('Invalid notification preference');
        }
    }
}
