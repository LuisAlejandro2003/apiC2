import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { UsersController } from './controllers/usersController';
import { CreateUsers } from '../application/use-cases/createUsers';
import { GetAllUsers } from '../application/use-cases/getAllUsers';
import { GetUserById } from '../application/use-cases/getUserById';
import { DeleteUserById } from '../application/use-cases/deleteUserById';
import { MongoUsersRepository } from './persistence/mongoUsersRepository';
import { MongoContactsRepository } from '../../contacts/infrastructure/persistence/mongoContacsRepository';
import { EventEmitterAdapter } from './adapters/eventEmitter';
import { FindContactByEmail } from '../../contacts/application/use-cases/findContactByEmail';
import { BcryptPasswordHasher } from './services/PasswordHasher';
import { TokenValidatedSubscriber } from './adapters/tokenValidatedSubscriber';
import { UpdateUserVerifiedAt } from '../application/use-cases/updateUserVerifiedAt';

dotenv.config();

export async function initializeUsersDependencies(): Promise<UsersController> {
    // Instancia de MongoClient
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();

    // Repositorios
    const usersRepository = new MongoUsersRepository(
        mongoClient.db(process.env.DB_NAME || 'microservicesClients')
    );
    const contactsRepository = new MongoContactsRepository(
        mongoClient.db(process.env.DB_NAME || 'microservicesClients')
    );

    // Caso de uso de búsqueda de contacto por email
    const findContactByEmail = new FindContactByEmail(contactsRepository);

    // Publicador de eventos
    const eventPublisher = new EventEmitterAdapter();
    await eventPublisher.connect();

    // Servicio de hash de contraseñas
    const passwordHasher = new BcryptPasswordHasher(); // Instancia de BcryptPasswordHasher

    // Caso de uso de CreateUsers, inyectando el servicio de hash de contraseñas
    const createUsers = new CreateUsers(usersRepository, findContactByEmail, eventPublisher, passwordHasher);

    // Caso de uso de UpdateUserVerifiedAt para actualizar la fecha de verificación
    const updateUserVerifiedAt = new UpdateUserVerifiedAt(usersRepository);
    const getAllUsers = new GetAllUsers(usersRepository);
    const getUserById = new GetUserById(usersRepository);
    const deleteUserById = new DeleteUserById(usersRepository);

    // Inicializa el suscriptor para la cola `token.validated`
    const tokenValidatedSubscriber = new TokenValidatedSubscriber(updateUserVerifiedAt);
    tokenValidatedSubscriber.listen().catch(console.error);

    // Controlador de Users
    return new UsersController(createUsers, getAllUsers, getUserById, deleteUserById);
}
