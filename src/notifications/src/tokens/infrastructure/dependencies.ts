import { Pool } from 'pg';
import { PostgresTokenRepository } from './persistence/postgresTokenRepository';
import { TwilioSender } from './adapters/twilioSender';
import { GenerateToken } from '../application/use-cases/generateToken';

export async function initializeTokenDependencies(): Promise<GenerateToken> {
    const dbPool = new Pool({ connectionString: process.env.POSTGRES_URI });
    const tokenRepository = new PostgresTokenRepository(dbPool);
    const tokenSender = new TwilioSender();

    return new GenerateToken(tokenRepository, tokenSender);
}
