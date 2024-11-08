import { ContactsRepository } from '../../domain/ports/contactsRepository';
import { Contacts } from '../../domain/entities/contacts';
import { ContactId } from '../../domain/value-objects/contactId';
import { EventPublisher } from '../../domain/ports/EventPublisher';

export class CreateContacts {
    private emittedEvents: Set<string> = new Set();

    private isDuplicateEvent(event: string): boolean {
        if (this.emittedEvents.has(event)) {
            return true;
        }
        this.emittedEvents.add(event);
        return false;
    }
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
    }): Promise<void> {
        const contacts = new Contacts(
            contactData.uuid ?? ContactId.generateUUID(),
            contactData.email,
            contactData.firstName,
            contactData.lastName,
            contactData.phoneNumber
        );
        await this.contactsRepository.createContact(contacts);

        // Emit event after creating the contact
        // Emit event after creating the contact only if not already emitted
if (!this.isDuplicateEvent('contact.created')) {
    await this.eventPublisher.emit('contact.created', {
        contactId: contacts.getContactsId().value,
        email: contacts.getEmail(),
        phoneNumber: contacts.getPhoneNumber()
    });
}
    }
}
