import { TokenRepository } from '../../domain/ports/tokenRepository'; // Importar correctamente
import { TokenSender } from '../../domain/ports/tokenSender'; // Importar correctamente
import { Token } from '../../domain/entities/token';
import { TokenId } from '../../domain/value-objects/tokenId';
import { NotificationId } from '../../../notifications/domain/value-objects/notificationId';
import { v4 as uuidv4 } from 'uuid';

export class GenerateToken {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly tokenSender: TokenSender
    ) {}

    async execute(contactId: string, phoneNumber: string): Promise<void> {
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const notificationId = new NotificationId(uuidv4());
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 23);

        const token = new Token(
            new TokenId(uuidv4()), // Usar TokenId correctamente
            tokenValue,
            contactId,
            new Date(),
            expiration,
            notificationId.id // Asegúrate de pasar el valor correctamente si es un string
        );

        await this.tokenRepository.saveToken(token);
        await this.tokenSender.sendToken(`+521${phoneNumber}`, tokenValue); // Prefijo incluido
    }
}
