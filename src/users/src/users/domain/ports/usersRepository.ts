import { Users } from '../entities/users';

export interface UsersRepository {
    createUser(user: Users): Promise<void>;
}
