// src/tokens/infrastructure/controllers/tokenController.ts
import { Request, Response } from 'express';
import { GenerateToken } from '../../application/use-cases/generateToken';

export class TokenController {
    constructor(private readonly generateToken: GenerateToken) {}

    async handleTokenGeneration(req: Request, res: Response): Promise<void> {
        const { userId, phoneNumber } = req.body;

        try {
            await this.generateToken.execute(userId, phoneNumber);
            res.status(200).send({ message: 'Token generated and sent successfully' });
        } catch (error) {
            console.error('Error generating and sending token:', error);
            res.status(500).send({ error: 'Error generating and sending token' });
        }
    }
}
