import { GenerateToken } from '../application/use-cases/generateToken';
import { ValidateToken } from '../application/use-cases/validateToken';
import { PostgresTokenRepository } from './persistence/postgresTokenRepository';
import { TwilioSender } from './adapters/twilioSender';
import { EmailService } from '../../notifications/infrastructure/services/emailService';
import { RabbitMQPublisher } from './adapters/rabbitMQPublisher';
import { Pool } from 'pg';
import { TokenController } from './controllers/tokenController';

export async function initializeTokenDependencies(): Promise<{ tokenController: TokenController; generateToken: GenerateToken; validateToken: ValidateToken; }> {
    const dbPool = new Pool({ connectionString: process.env.POSTGRES_URI });
    const tokenRepository = new PostgresTokenRepository(dbPool);
    const tokenSender = new TwilioSender();
    const emailService = new EmailService(); // Servicio de correo electrónico

    const generateToken = new GenerateToken(tokenRepository, tokenSender, emailService); // Añadir emailService aquí
    const validateToken = new ValidateToken(tokenRepository, new RabbitMQPublisher('token.validated'));

    const tokenController = new TokenController(generateToken, validateToken);

    return { tokenController, generateToken, validateToken };
}
