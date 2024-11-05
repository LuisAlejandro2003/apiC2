// src/tokens/application/use-cases/generateToken.ts
import { Token } from '../../domain/entities/token';
import { TokenRepository } from '../../domain/ports/tokenRepository';
import { TokenSender } from '../../domain/ports/tokenSender';

export class GenerateToken {
    constructor(
        private tokenRepository: TokenRepository,
        private tokenSender: TokenSender
    ) {}

    async execute(contactId: string, phoneNumber: string): Promise<void> {
        // Formatea el número de teléfono con el prefijo +521 si no lo tiene ya
        const formattedPhoneNumber = phoneNumber.startsWith('+521') ? phoneNumber : `+521${phoneNumber}`;
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString(); // Genera un token de 4 dígitos
        const token = new Token(undefined, tokenValue, contactId);
    
        // Guarda el token en el repositorio
        await this.tokenRepository.saveToken(token);
    
        // Envía el token utilizando la interfaz
        await this.tokenSender.sendToken(formattedPhoneNumber, tokenValue);
    }
    
}
