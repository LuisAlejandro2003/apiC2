export class NotificationId {
    constructor(private readonly value: string = generateUUID()) {
        if (!value) {
            throw new Error('Notification ID cannot be empty');
        }
    }

    get id(): string {
        return this.value;
    }
    toString(): string {
        return this.value; // Este método asegura la compatibilidad cuando se espera una cadena.
    }
    getValue(): string {
        return this.value;
    }

}

// Función para generar un UUID (similar a tu ejemplo)
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
