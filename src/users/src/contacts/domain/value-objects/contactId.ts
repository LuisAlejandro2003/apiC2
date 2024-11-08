export class ContactId {
    constructor(private id: string = ContactId.generateUUID()) {
        if (!id) throw new Error('ContactId cannot be empty');
    }

    get value(): string {
        return this.id;
    }

    equals(other: ContactId): boolean {
        return this.id === other.value;
    }

    static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

