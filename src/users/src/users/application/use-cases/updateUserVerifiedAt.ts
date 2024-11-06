// src/users/application/use-cases/updateUserVerifiedAt.ts
import { UsersRepository } from '../../domain/ports/usersRepository';
import { UserId } from '../../domain/value-objects/userId';

export class UpdateUserVerifiedAt {
    constructor(private usersRepository: UsersRepository) {}

    async execute(userId: string, verifiedAt: string): Promise<void> {
        const userIdentifier = new UserId(userId);
        await this.usersRepository.updateVerifiedAt(userIdentifier.value, verifiedAt);
    }
}
