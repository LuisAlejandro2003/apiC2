import jwt from 'jsonwebtoken';
import { JwtRepository } from '../../domain/ports/jwtRepository';

export class JwtRepositoryImpl implements JwtRepository {
    private readonly secret = 'your-secret-key';

    generateToken(userId: string): string {
        return jwt.sign({ userId }, this.secret, { expiresIn: '1h' });
    }

    verifyToken(token: string): string {
        try {
            const decoded = jwt.verify(token, this.secret) as { userId: string };
            return decoded.userId;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
