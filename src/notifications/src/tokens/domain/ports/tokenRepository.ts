// src/tokens/domain/ports/tokenRepository.ts
import { Token } from '../entities/token'; // Importa la clase Token correctamente

export interface TokenRepository {
    saveToken(token: Token): Promise<void>; // Asegúrate de usar 'saveToken' en todos lados
}
