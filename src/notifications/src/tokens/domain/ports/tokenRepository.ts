// src/tokens/domain/ports/tokenRepository.ts
import { Token } from '../entities/token';

export interface TokenRepository {
  saveToken(token: Token): Promise<void>;
  findTokenByUserId(userId: string): Promise<Token | null>;
}
