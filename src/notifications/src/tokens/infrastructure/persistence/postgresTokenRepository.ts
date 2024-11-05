// src/tokens/infrastructure/persistence/postgresTokenRepository.ts
import { Pool } from 'pg';
import { Token } from '../../domain/entities/token';
import { TokenRepository } from '../../domain/ports/tokenRepository';

export class PostgresTokenRepository implements TokenRepository {
    constructor(private readonly db: Pool) {}

    async saveToken(token: Token): Promise<void> {
        await this.db.query(
            'INSERT INTO tokens (uuid, value, user_id, created_at) VALUES ($1, $2, $3, $4)',
            [token.uuid, token.value, token.userId, token.createdAt]
        );
    }
}
