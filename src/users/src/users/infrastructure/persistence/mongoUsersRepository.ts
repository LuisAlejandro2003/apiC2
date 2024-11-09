import { UsersRepository } from '../../domain/ports/usersRepository';
import { Users } from '../../domain/entities/users';
import { UserId } from '../../domain/value-objects/userId';
import { ContactId } from '../../../contacts/domain/value-objects/contactId';
import { Db } from 'mongodb';

export class MongoUsersRepository implements UsersRepository {
    constructor(private db: Db) {}

    async createUser(user: Users): Promise<void> {
        const userToSave = user.toPersistence(); // Convierte al formato correcto
        await this.db.collection('users').insertOne(userToSave);
    }

    async updateVerifiedAt(userId: string, verifiedAt: string): Promise<void> {
        await this.db.collection('users').updateOne(
            { contactId: userId },
            { $set: { verifiedAt } }
        );
    }

    async findAll(): Promise<Users[]> {
        const usersData = await this.db.collection('users').find().toArray();
        return usersData.map(data => new Users(
            new UserId(data.id),
            data.email,
            data.password,
            data.verifiedAt,
            new ContactId(data.contactId)
        ));
    }

    async findById(userId: string): Promise<Users | null> {
        const userData = await this.db.collection('users').findOne({ id: userId });
        if (!userData) return null;
        return new Users(
            new UserId(userData.id),
            userData.email,
            userData.password,
            userData.verifiedAt,
            new ContactId(userData.contactId)
        );
    }

    async deleteById(userId: string): Promise<void> {
        await this.db.collection('users').deleteOne({ id: userId });
    }
}