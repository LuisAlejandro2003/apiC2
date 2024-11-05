// src/tokens/infrastructure/controllers/tokenController.ts
import { Request, Response } from 'express';
import { GenerateToken } from '../../application/use-cases/generateToken';
import { ValidateToken } from '../../application/use-cases/validateToken';

export class TokenController {
    constructor(private readonly generateToken: GenerateToken, private readonly validateToken: ValidateToken) {}
    


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



    async handleTokenValidation(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const { tokenValue } = req.body;

        try {
            await this.validateToken.execute(userId, tokenValue);
            res.status(200).send({ message: 'Token validated successfully' });
        } catch (error) {
            console.error('Error validating token:', error);
            res.status(400).send({ error: error });
        }
    }
}
