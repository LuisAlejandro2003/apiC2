import { AuthRepository } from '../../domain/ports/authRepository';
import { Db } from 'mongodb';

export class MongoAuthRepository implements AuthRepository {
    constructor(private db: Db) {}

    async findByEmail(email: string): Promise<{ uuid: string; email: string; password: string } | null> {
        const user = await this.db.collection('users').findOne({ email });
        return user ? { uuid: user.uuid, email: user.email, password: user.password } : null;
    }

    async validatePassword(user: { uuid: string; email: string; password: string }, password: string): Promise<boolean> {
        // Assume bcrypt is used for password hashing
        const bcrypt = require('bcrypt');
        return bcrypt.compare(password, user.password);
    }
}
