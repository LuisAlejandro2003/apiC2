import { ContactsRepository } from '../../domain/ports/contactsRepository';
import { Contacts } from '../../domain/entities/contacts';
import { Db } from 'mongodb';

export class MongoContactsRepository implements ContactsRepository {
    constructor(private db: Db) {}

    async findByEmail(email: string): Promise<Contacts | null> {
        const contactData = await this.db.collection('contacts').findOne({ email });
        if (!contactData) {
            return null;
        }
        return new Contacts(
            contactData.uuid,
            contactData.email,
            contactData.firstName,
            contactData.lastName,
            contactData.phoneNumber
        );
    }

    async findAll(): Promise<Contacts[]> {
        const contactsData = await this.db.collection('contacts').find().toArray();
        return contactsData.map(contactData => new Contacts(
            contactData.uuid,
            contactData.email,
            contactData.firstName,
            contactData.lastName,
            contactData.phoneNumber
        ));
    }

    async findById(uuid: string): Promise<Contacts | null> {
        const contactData = await this.db.collection('contacts').findOne({ uuid });
        if (!contactData) {
            return null;
        }
        return new Contacts(
            contactData.uuid,
            contactData.email,
            contactData.firstName,
            contactData.lastName,
            contactData.phoneNumber
        );
    }

    async createContact(contacts: Contacts): Promise<void> {
        const contactToSave = {
            uuid: contacts.getContactsId().value,
            email: contacts.getEmail(),
            firstName: contacts.getFullName().split(' ')[0],
            lastName: contacts.getFullName().split(' ')[1],
            phoneNumber: contacts.getPhoneNumber()
        };
        await this.db.collection('contacts').insertOne(contactToSave);
    }

    async updateContact(uuid: string, contactData: Partial<Omit<Contacts, 'uuid'>>): Promise<void> {
        await this.db.collection('contacts').updateOne(
            { uuid },
            { $set: contactData }
        );
    }

    async deleteContact(uuid: string): Promise<void> {
        await this.db.collection('contacts').deleteOne({ uuid });
    }
}
