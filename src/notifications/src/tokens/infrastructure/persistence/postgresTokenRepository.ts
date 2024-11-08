// src/tokens/infrastructure/persistence/postgresTokenRepository.ts
import { Pool } from 'pg';
import { Token } from '../../domain/entities/token';
import { TokenRepository } from '../../domain/ports/tokenRepository';

export class PostgresTokenRepository implements TokenRepository {
    constructor(private readonly db: Pool) {}

    async saveToken(token: Token): Promise<void> {
        const query = `
            INSERT INTO tokens (uuid, value, user_id, created_at, expiration, notification_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [
            token.uuid.getValue(),
            token.value,
            token.userId,
            token.createdAt,
            token.expiration,
            token.notificationId
        ];

        await this.db.query(query, values);
    }

    async findTokenByUserId(userId: string): Promise<Token | null> {
        return this.findTokenByFields({ user_id: userId });
    }

    async findByUserIdAndValue(userId: string, tokenValue: string): Promise<Token | null> {
        return this.findTokenByFields({ user_id: userId, value: tokenValue });
    }

    private async findTokenByFields(fields: { [key: string]: any }): Promise<Token | null> {
        const conditions = Object.keys(fields).map((field, index) => `${field} = $${index + 1}`).join(' AND ');
        const values = Object.values(fields);

        const result = await this.db.query(`SELECT * FROM tokens WHERE ${conditions}`, values);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new Token(
            row.uuid,
            row.value,
            row.user_id,
            new Date(row.created_at),
            new Date(row.expiration),
            row.notification_id
        );
    }
}
