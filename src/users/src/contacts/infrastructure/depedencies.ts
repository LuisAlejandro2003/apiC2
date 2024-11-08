import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { ContactsController } from './controllers/contactsController';
import { CreateContacts } from '../application/use-cases/createContacts';
import { FindContactByEmail } from '../application/use-cases/findContactByEmail';
import { FindAllContacts } from '../application/use-cases/findAllContacts';
import { UpdateContact } from '../application/use-cases/updateContact';
import { DeleteContact } from '../application/use-cases/deleteContact';
import { MongoContactsRepository } from './persistence/mongoContacsRepository';
import { EventEmitterAdapter } from './adapters/eventEmitter';

dotenv.config();

export async function initializeContactsDependencies(): Promise<ContactsController> {
    // Instancia de MongoClient
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();

    // Repositorio de contactos
    const contactsRepository = new MongoContactsRepository(
        mongoClient.db(process.env.DB_NAME || 'microservicesClients')
    );

    // Publicador de eventos
    const eventPublisher = new EventEmitterAdapter();
    await eventPublisher.connect();

    // Casos de uso
    const createContacts = new CreateContacts(contactsRepository, eventPublisher);
    const findContactByEmail = new FindContactByEmail(contactsRepository);
    const findAllContacts = new FindAllContacts(contactsRepository);
    const updateContact = new UpdateContact(contactsRepository);
    const deleteContact = new DeleteContact(contactsRepository);

    // Controlador de contactos
    return new ContactsController(createContacts, findContactByEmail, findAllContacts, updateContact, deleteContact);
}
