import { AuthRepository } from '../../domain/ports/authRepository';
import { JwtRepository } from '../../domain/ports/jwtRepository';

export class Login {
    constructor(
        private authRepository: AuthRepository,
        private jwtRepository: JwtRepository
    ) {}

    async execute(email: string, password: string): Promise<string> {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await this.authRepository.validatePassword(user, password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        return this.jwtRepository.generateToken(user.uuid);
    }
}