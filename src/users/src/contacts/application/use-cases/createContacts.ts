import { Contacts } from '../../domain/entities/contacts';
import { ContactsRepository } from '../../domain/ports/contactsRepository';
import { EventPublisher } from '../../domain/ports/EventPublisher';
import { ContactId } from '../../domain/value-objects/contactId';

export class CreateContacts {
    constructor(
        private contactsRepository: ContactsRepository,
        private eventPublisher: EventPublisher
    ) {}

    async execute(contactData: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        contactId?: string;
    }): Promise<void> {
        // Generar un nuevo contactId si no se proporciona
        const contactId = contactData.contactId ? new ContactId(contactData.contactId) : new ContactId();

        // Crear la instancia del contacto
        const contact = new Contacts(contactId.value, contactData.firstName, contactData.lastName, contactData.email, contactData.phoneNumber);

        // Guardar el contacto en el repositorio
        await this.contactsRepository.createContact(contact);

        // Emitir el evento con contactId, email y phoneNumber
        await this.eventPublisher.emit('contact.created', {
            contactId: contact.uuid,
            email: contact.email,
            phoneNumber: contact.phoneNumber
        });
    }
}

