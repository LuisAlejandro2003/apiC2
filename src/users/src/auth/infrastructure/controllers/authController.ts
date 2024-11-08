import { Request, Response } from 'express';
import { Login } from '../../application/use-cases/login';

export class AuthController {
    constructor(private login: Login) {}

    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }
            const token = await this.login.execute(email, password);
            res.json({ token });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User not found') {
                    res.status(404).json({ error: 'User not found' });
                } else if (error.message === 'Invalid credentials') {
                    res.status(401).json({ error: 'Invalid credentials' });
                } else {
                    res.status(500).json({ error: 'Internal server error', details: error.message });
                }
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}