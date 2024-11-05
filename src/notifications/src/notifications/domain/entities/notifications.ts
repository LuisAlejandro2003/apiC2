import { v4 as uuidv4 } from 'uuid';

export class Notifications {
    constructor(
        public idNotification: string,
        public contactId: string,
        public email: string,
        public phoneNumber: string,
        public dateSent: Date = new Date()
    ) {}
}
