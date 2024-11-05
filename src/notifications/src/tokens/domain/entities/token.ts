import { v4 as uuidv4 } from 'uuid';

export class Token {
    constructor(
        public uuid: string = uuidv4(), // Genera un UUID por defecto si no se proporciona
        public value: string,
        public userId: string,
        public createdAt: Date = new Date() // Fecha de creación por defecto
    ) {}
}
