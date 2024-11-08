import { Contacts } from '../entities/contacts';

export interface ContactsRepository {
    findByEmail(email: string): Promise<Contacts | null>;
    createContact(contacts: Contacts): Promise<void>;
    findAll(): Promise<Contacts[]>;
    findById(uuid: string): Promise<Contacts | null>;
    updateContact(uuid: string, contactData: Partial<Omit<Contacts, 'uuid'>>): Promise<void>;
    deleteContact(uuid: string): Promise<void>;
}
