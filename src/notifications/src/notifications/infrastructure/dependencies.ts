import { Pool } from 'pg';
import dotenv from 'dotenv';
import { NotificationsController } from './controllers/NotificationsController';
import { SendNotification } from '../application/use-cases/sendNotification';
import { PostgresNotificationsRepository } from './persistence/postgresNotificationsRepository';
import { EmailService } from './services/emailService';
import { RabbitMQListener } from './adapters/rabbitMQListener';

dotenv.config();

export async function initializeDependencies(): Promise<{
    notificationsController: NotificationsController;
    rabbitMQListener: RabbitMQListener;
}> {
    const postgresPool = new Pool({
        connectionString: process.env.POSTGRES_URI,
    });

    const notificationsRepository = new PostgresNotificationsRepository(postgresPool);
    const emailService = new EmailService();
    const sendNotification = new SendNotification(notificationsRepository, emailService);
    const notificationsController = new NotificationsController(sendNotification);
    const rabbitMQListener = new RabbitMQListener(notificationsController);

    return { notificationsController, rabbitMQListener };
}
