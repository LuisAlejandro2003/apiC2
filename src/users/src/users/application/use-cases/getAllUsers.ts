import { UsersRepository } from '../../domain/ports/usersRepository';
import { Users } from '../../domain/entities/users';

export class GetAllUsers {
    constructor(private usersRepository: UsersRepository) {}

    async execute(): Promise<Users[]> {
        return this.usersRepository.findAll();
    }
}