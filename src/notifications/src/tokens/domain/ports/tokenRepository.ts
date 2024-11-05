// src/tokens/domain/ports/tokenRepository.ts
import { Token } from '../entities/token';

export interface TokenRepository {
  saveToken(token: Token): Promise<void>;
  
  findByUserIdAndValue(userId: string, tokenValue: string): Promise<Token | null>;
}
