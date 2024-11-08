import { UsersRepository } from '../../domain/ports/usersRepository';
import { Users } from '../../domain/entities/users';
import { Db } from 'mongodb';

export class MongoUsersRepository implements UsersRepository {
    constructor(private db: Db) {}

    async createUser(user: Users): Promise<void> {
        const userToSave = user.toPersistence(); // Convierte al formato correcto
        await this.db.collection('users').insertOne(userToSave);
    }

    async updateVerifiedAt(userId: string, verifiedAt: string): Promise<void> {
        await this.db.collection('users').updateOne(
            { id: userId },
            { $set: { verifiedAt } }
        );
    }
}