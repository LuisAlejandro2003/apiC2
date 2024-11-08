export interface JwtRepository {
    generateToken(userId: string): string;
    verifyToken(token: string): string;
}
