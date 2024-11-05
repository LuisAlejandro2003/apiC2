import { Contacts } from '../entities/contacts';

export interface ContactsRepository {
    createContact(contact: Contacts): Promise<void>;
    findByEmail(email: string): Promise<Contacts | null>; 

}
