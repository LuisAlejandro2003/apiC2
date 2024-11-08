import { ContactsRepository } from '../../domain/ports/contactsRepository';
import { Contacts } from '../../domain/entities/contacts';

export class FindAllContacts {
    constructor(private contactsRepository: ContactsRepository) {}

    async execute(): Promise<Contacts[]> {
        return this.contactsRepository.findAll();
    }
}
