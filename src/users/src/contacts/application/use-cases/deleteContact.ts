import { ContactsRepository } from '../../domain/ports/contactsRepository';

export class DeleteContact {
    constructor(private contactsRepository: ContactsRepository) {}

    async execute(uuid: string): Promise<void> {
        await this.contactsRepository.deleteContact(uuid);
    }
}