import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { EventEmitter } from './adapters/eventEmitter';
import { ContactsController } from './controllers/contactsController';
import { CreateContacts } from '../application/use-cases/createContacts';
import { MongoContactsRepository } from './persistence/mongoContacsRepository';



dotenv.config();

export async function initializeContactsController() {
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();

    const eventEmitter = new EventEmitter();
    await eventEmitter.connect();

    const contactsRepository = new MongoContactsRepository(mongoClient, process.env.DB_NAME || 'microservicesContacts');
    const createContacts = new CreateContacts(contactsRepository, eventEmitter);

    return new ContactsController(createContacts);
}