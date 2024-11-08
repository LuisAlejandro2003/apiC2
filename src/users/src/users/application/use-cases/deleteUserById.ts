import { UsersRepository } from '../../domain/ports/usersRepository';
import { UserId } from '../../domain/value-objects/userId';

export class DeleteUserById {
    constructor(private usersRepository: UsersRepository) {}

    async execute(userId: string): Promise<void> {
        const userIdentifier = new UserId(userId);
        await this.usersRepository.deleteById(userIdentifier.value);
    }
}
