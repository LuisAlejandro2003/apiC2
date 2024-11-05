import { TokenRepository } from '../../domain/ports/tokenRepository';
import { EventPublisher } from '../../domain/ports/eventPublisher';

export class ValidateToken {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(userId: string, tokenValue: string): Promise<void> {
        const token = await this.tokenRepository.findByUserIdAndValue(userId, tokenValue);

        if (!token) {
            throw new Error('Token not found or does not match');
        }

        const now = new Date();
        const tokenExpirationBuffer = new Date(token.expiration);
        tokenExpirationBuffer.setHours(tokenExpirationBuffer.getHours() + 23); // Ajuste temporal de 5 minutos
        
        if (now > tokenExpirationBuffer) {
            throw new Error('Token has expired');
        }
        
        

   
        // Publicar evento de validación exitosa
        await this.eventPublisher.publish('token.validated', {
            userId: token.userId,
            validatedAt: new Date().toISOString()
        });
    }
}
