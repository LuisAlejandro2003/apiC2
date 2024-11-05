import { GenerateToken } from '../application/use-cases/generateToken';
import { ValidateToken } from '../application/use-cases/validateToken';
import { PostgresTokenRepository } from './persistence/postgresTokenRepository';
import { TwilioSender } from './adapters/twilioSender';
import { RabbitMQPublisher } from './adapters/rabbitMQPublisher';
import { Pool } from 'pg';
import { TokenController } from './controllers/tokenController';

export async function initializeTokenDependencies(): Promise<{ tokenController: TokenController; generateToken: GenerateToken; validateToken: ValidateToken; }> {
    const dbPool = new Pool({ connectionString: process.env.POSTGRES_URI });
    const tokenRepository = new PostgresTokenRepository(dbPool);
    const tokenSender = new TwilioSender();
    const eventPublisher = new RabbitMQPublisher('token.validated');

    // Inicializar el publisher
    await eventPublisher.initialize();

    const generateToken = new GenerateToken(tokenRepository, tokenSender);
    const validateToken = new ValidateToken(tokenRepository, eventPublisher);

    const tokenController = new TokenController(generateToken, validateToken);
    return { tokenController, generateToken, validateToken };
}
