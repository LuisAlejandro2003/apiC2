import { ContactsRepository } from '../../domain/ports/contactsRepository';
import { Contacts } from '../../domain/entities/contacts';
import { ContactId } from '../../domain/value-objects/contactId';
import { EventPublisher } from '../../domain/ports/EventPublisher';

export class CreateContacts {
    constructor(
        private contactsRepository: ContactsRepository,
        private eventPublisher: EventPublisher
    ) {}

    async execute(contactData: {
        uuid?: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        notificationPreference: string;
    }): Promise<void> {
        const contacts = new Contacts(
            contactData.uuid ?? ContactId.generateUUID(),
            contactData.email,
            contactData.firstName,
            contactData.lastName,
            contactData.phoneNumber
        );
        
        await this.contactsRepository.createContact(contacts);

        // Emitir evento después de crear el contacto sin restricciones
        await this.eventPublisher.emit('contact.created', {
            contactId: contacts.getContactsId().value,
            email: contacts.getEmail(),
            phoneNumber: contacts.getPhoneNumber(),
            notificationPreference: contactData.notificationPreference
        });
    }
}
