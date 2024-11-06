import { CreatePayment } from '../application/use-cases/createPayment';
import { MysqlPaymentRepository } from './persistence/mysqlPaymentRepository';
import { RabbitMQPublisher } from './adapters/rabbitMQPublisher';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
export async function initializeDependencies() {
    const db = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD || 'userpassword',
        database: process.env.DB_NAME || 'payments_db',
        port: Number(process.env.DB_PORT) || 3307,
    });

    const paymentRepository = new MysqlPaymentRepository(db);
    const eventPublisher = new RabbitMQPublisher();
    await eventPublisher.connect();

    return {
        createPayment: new CreatePayment(paymentRepository, eventPublisher),
    };
}