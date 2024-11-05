export class UserId {
    constructor(private readonly id: string = generateUUID()) { // Generar un UUID si no se pasa un argumento
        if (!id) throw new Error('UserId cannot be empty');
    }

    get value(): string {
        return this.id;
    }

    equals(other: UserId): boolean {
        return this.id === other.value;
    }
}

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
