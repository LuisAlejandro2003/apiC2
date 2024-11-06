import { Users } from '../entities/users';

export interface UsersRepository {
    createUser(user: Users): Promise<void>;
    updateVerifiedAt(userId: string, verifiedAt: string): Promise<void>; // Agregado para actualizar el campo verifiedAt

}
