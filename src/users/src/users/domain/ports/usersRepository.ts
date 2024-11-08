import { Users } from '../entities/users';

export interface UsersRepository {
    createUser(user: Users): Promise<void>;
    updateVerifiedAt(userId: string, verifiedAt: string): Promise<void>; 
    findAll(): Promise<Users[]>; 
    findById(userId: string): Promise<Users | null>; 
    deleteById(userId: string): Promise<void>; 
}
