import { UserId } from '../value-objects/userId';
import { ContactId } from '../../../contacts/domain/value-objects/contactId';

export class Users {
    constructor(
        private userId: UserId, // Usar private para evitar que se serialice
        public email: string,
        public password: string,
        public verifiedAt: string | null,
        public contactId: ContactId
    ) {}

    toPersistence() {
        return {
            id: this.userId.value,
            email: this.email,
            password: this.password,
            verifiedAt: this.verifiedAt,
            contactId: this.contactId.value // Convierte contactId a string
        };
    }
}
