import { ContactsRepository } from '../../domain/ports/contactsRepository';
import { Contacts } from '../../domain/entities/contacts';
import { MongoClient, Db } from 'mongodb';
import { ContactId } from '../../domain/value-objects/contactId';

export class MongoContactsRepository implements ContactsRepository {
    private db: Db;

    constructor(private client: MongoClient, dbName: string) {
        this.db = client.db(dbName);
    }

    async createContact(contact: Contacts): Promise<void> {
        await this.db.collection('contacts').insertOne(contact);
    }

    async findByEmail(email: string): Promise<Contacts | null> {
        const contact = await this.db.collection('contacts').findOne({ email });
        return contact
            ? new Contacts(
                contact.uuid,
                contact.firstName,
                contact.lastName,
                contact.email,
                contact.phoneNumber
         
              )
            : null;
    }
}
