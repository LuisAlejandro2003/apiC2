import { Pool } from 'pg';
import { PostgresTokenRepository } from './persistence/postgresTokenRepository';
import { TwilioSender } from './adapters/twilioSender';
import { GenerateToken } from '../application/use-cases/generateToken';
import { TokenController } from './controllers/tokenController';

export async function initializeTokenDependencies(): Promise<{ generateToken: GenerateToken; tokenController: TokenController }> {
    // Configura la conexión de la base de datos PostgreSQL
    const dbPool = new Pool({
        connectionString: process.env.POSTGRES_URI, // Asegúrate de que tu variable de entorno esté configurada
    });

    // Crea las instancias necesarias
    const tokenRepository = new PostgresTokenRepository(dbPool);
    const tokenSender = new TwilioSender();
    const generateToken = new GenerateToken(tokenRepository, tokenSender);
    const tokenController = new TokenController(generateToken);

    return { generateToken, tokenController }; // Retorna ambas instancias si es necesario
}
