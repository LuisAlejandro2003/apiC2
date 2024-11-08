import { ContactsRepository } from '../../domain/ports/contactsRepository';
import { Contacts } from '../../domain/entities/contacts';

export class UpdateContact {
    constructor(private contactsRepository: ContactsRepository) {}

    async execute(uuid: string, contactData: Partial<Omit<Contacts, 'uuid'>>): Promise<void> {
        await this.contactsRepository.updateContact(uuid, contactData);
    }
}
