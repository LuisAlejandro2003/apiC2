// tokens/infrastructure/dependencies.ts
import { GenerateToken } from '../application/use-cases/generateToken';
import { PostgresTokenRepository } from './persistence/postgresTokenRepository';
import { TwilioSender } from './adapters/twilioSender';
import { Pool } from 'pg';

export async function initializeTokenDependencies(): Promise<GenerateToken> {
    const dbPool = new Pool({ connectionString: process.env.POSTGRES_URI });
    const tokenRepository = new PostgresTokenRepository(dbPool);
    const tokenSender = new TwilioSender();

    // Retorna una instancia de GenerateToken, no TokenController
    return new GenerateToken(tokenRepository, tokenSender);
}
