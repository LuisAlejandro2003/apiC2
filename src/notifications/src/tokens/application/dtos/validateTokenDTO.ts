export class ValidateTokenDTO {
    constructor(
        public readonly userId: string,
        public readonly tokenValue: string
    ) {}

    static validate(data: any): ValidateTokenDTO {
        if (!data.userId || typeof data.userId !== 'string') {
            throw new Error('Invalid userId');
        }
        if (!data.tokenValue || typeof data.tokenValue !== 'string') {
            throw new Error('Invalid tokenValue');
        }
        return new ValidateTokenDTO(data.userId, data.tokenValue);
    }
}
