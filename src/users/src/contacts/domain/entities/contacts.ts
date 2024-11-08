import { ContactId } from '../value-objects/contactId';

export class Contacts {
    constructor(
        public uuid: string = ContactId.generateUUID(),
        public email: string,
        public firstName: string,
        public lastName: string,
        public phoneNumber: string
    ) {}

    getContactsId(): ContactId {
        return new ContactId(this.uuid);
    }

    getEmail(): string {
        return this.email;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    updateDetails(contactData: Partial<Pick<Contacts, 'email' | 'firstName' | 'lastName' | 'phoneNumber'>>): void {
        if (contactData.email !== undefined) this.email = contactData.email;
        if (contactData.firstName !== undefined) this.firstName = contactData.firstName;
        if (contactData.lastName !== undefined) this.lastName = contactData.lastName;
        if (contactData.phoneNumber !== undefined) this.phoneNumber = contactData.phoneNumber;
    }
}
