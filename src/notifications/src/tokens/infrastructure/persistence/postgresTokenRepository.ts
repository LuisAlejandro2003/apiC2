// src/tokens/infrastructure/persistence/postgresTokenRepository.ts
import { Pool } from 'pg';
import { Token } from '../../domain/entities/token';
import { TokenRepository } from '../../domain/ports/tokenRepository';

export class PostgresTokenRepository implements TokenRepository {
  constructor(private readonly db: Pool) {}

  public async saveToken(token: Token): Promise<void> {
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
    const result = await this.db.query(
      'SELECT * FROM tokens WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new Token(
      row.uuid,
      row.value,
      row.user_id,
      row.created_at,
      row.expiration,
      row.notification_id
    );
  }



  
 

  async findByUserIdAndValue(userId: string, tokenValue: string): Promise<Token | null> {
    const result = await this.db.query(
        'SELECT * FROM tokens WHERE user_id = $1 AND value = $2',
        [userId, tokenValue]
    );

    console.log('UserId:', userId);
    console.log('TokenValue:', tokenValue);

    if (result.rows.length > 0) {
        const tokenData = result.rows[0];
        
        // Asegúrate de crear el Token con los argumentos correctos
        return new Token(
            tokenData.uuid,              // UUID del token
            tokenData.value,             // Valor del token
            tokenData.user_id,           // ID del usuario
            new Date(tokenData.created_at), // Fecha de creación
            new Date(tokenData.expiration), // Fecha de expiración
            tokenData.notification_id    // ID de la notificación
        );
    }

    return null; // Devolver `null` si no se encontró el token
}






}
