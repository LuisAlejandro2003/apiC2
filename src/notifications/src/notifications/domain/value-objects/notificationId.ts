export class NotificationId {
    constructor(private readonly value: string) {
        if (!value) {
            throw new Error('Notification ID cannot be empty');
        }
    }

    get id(): string {
        return this.value;
    }
}
