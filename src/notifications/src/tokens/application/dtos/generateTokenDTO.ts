export class GenerateTokenDTO {
    constructor(
        public readonly contactId: string,
        public readonly phoneNumber: string
    ) {}

    static validate(data: any): GenerateTokenDTO {
        if (!data.contactId || typeof data.contactId !== 'string') {
            throw new Error('Invalid contactId');
        }
        if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
            throw new Error('Invalid phoneNumber');
        }
        return new GenerateTokenDTO(data.contactId, data.phoneNumber);
    }
}
