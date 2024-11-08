import { UsersRepository } from '../../domain/ports/usersRepository';
import { UserId } from '../../domain/value-objects/userId';
import { Users } from '../../domain/entities/users';

export class GetUserById {
    constructor(private usersRepository: UsersRepository) {}

    async execute(userId: string): Promise<Users | null> {
        const userIdentifier = new UserId(userId);
        return this.usersRepository.findById(userIdentifier.value);
    }
}