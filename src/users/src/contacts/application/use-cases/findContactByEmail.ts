import { ContactsRepository } from '../../domain/ports/contactsRepository';

export class FindContactByEmail {
    constructor(private contactsRepository: ContactsRepository) {}

    async execute(email: string): Promise<{ uuid: string; phoneNumber: string; email: string } | null> {
        const contact = await this.contactsRepository.findByEmail(email);
        if (!contact) {
            return null;
        }
        
        // Asegúrate de que el repositorio esté devolviendo estos campos
        return {
            uuid: contact.uuid,
            phoneNumber: contact.phoneNumber,
            email: contact.email
        };
    }
}
