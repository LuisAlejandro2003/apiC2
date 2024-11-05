import { TokenId } from '../value-objects/tokenId';

export class Token {
    constructor(
        public readonly uuid: TokenId, // Usa TokenId aquí
        public readonly value: string,
        public readonly userId: string,
        public readonly createdAt: Date,
        public readonly expiration: Date,
        public readonly notificationId: string 
    ) {}

    isExpired(): boolean {
        return new Date() > this.expiration;
    }
}
