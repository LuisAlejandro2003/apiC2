import { CreatePayment } from '../application/use-cases/createPayment';
import { CreatePaymentOrder } from '../application/use-cases/createPaymentOrder';
import { StorePayment } from '../application/use-cases/storePayment';
import { GetAllPayments } from '../application/use-cases/getAllPayments';
import { GetPaymentById } from '../application/use-cases/getPaymentById';
import { DeletePaymentById } from '../application/use-cases/deletePaymentById';
import { MysqlPaymentRepository } from './persistence/mysqlPaymentRepository';
import { RabbitMQPublisher } from './adapters/rabbitMQPublisher';
import { PayPalGateway } from './adapters/PayPalGateway';
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
    const paymentGateway = new PayPalGateway();

    await eventPublisher.connect();

    // Instancia de los casos de uso específicos
    const createPaymentOrder = new CreatePaymentOrder(paymentGateway);
    const storePayment = new StorePayment(paymentRepository, eventPublisher);
    const createPayment = new CreatePayment(createPaymentOrder, storePayment);
    const getAllPayments = new GetAllPayments(paymentRepository);
    const getPaymentById = new GetPaymentById(paymentRepository);
    const deletePaymentById = new DeletePaymentById(paymentRepository);

    return {
        createPayment,
        getAllPayments,
        getPaymentById,
        deletePaymentById,
    };
}
