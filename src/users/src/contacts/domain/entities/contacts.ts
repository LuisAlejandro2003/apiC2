import { ContactId } from '../value-objects/contactId';
import { v4 as uuidv4 } from 'uuid';

export class Contacts {
    constructor(
        public uuid: string = uuidv4(),
        public firstName: string,
        public lastName: string,
        public email: string,
        public phoneNumber: string,

    ) {}
}
