export class TokenId {
    constructor(private readonly value: string) {
        if (!value) {
            throw new Error('Token ID cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }
}
