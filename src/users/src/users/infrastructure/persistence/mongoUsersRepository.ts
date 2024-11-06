import { UsersRepository } from '../../domain/ports/usersRepository';
import { Users } from '../../domain/entities/users';
import { MongoClient, Db } from 'mongodb';

export class MongoUsersRepository implements UsersRepository {
    private db: Db;

    constructor(private client: MongoClient, dbName: string) {
        this.db = client.db(dbName);
    }

    async createUser(user: Users): Promise<void> {
        const userToSave = user.toPersistence(); // Convierte al formato correcto
        await this.db.collection('users').insertOne(userToSave);
    }


    
}
