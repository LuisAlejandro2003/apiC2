export interface AuthRepository {
    findByEmail(email: string): Promise<{ uuid: string; email: string; password: string } | null>;
    validatePassword(user: { uuid: string; email: string; password: string }, password: string): Promise<boolean>;
}