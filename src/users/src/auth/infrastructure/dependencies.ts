import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { AuthController } from './controllers/authController';
import { Login } from '../application/use-cases/login';
import { MongoAuthRepository } from './persistence/mongoAuthRepository';
import { JwtRepositoryImpl } from './adapters/JwtAdapterImpl';

dotenv.config();

export async function initializeAuthDependencies(): Promise<AuthController> {
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();

    const authRepository = new MongoAuthRepository(mongoClient.db(process.env.DB_NAME || 'microservicesClients'));
    const jwtRepository = new JwtRepositoryImpl();
    const login = new Login(authRepository, jwtRepository);

    return new AuthController(login);
}