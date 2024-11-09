// src/tokens/infrastructure/controllers/tokenController.ts
import { Request, Response } from 'express';
import { GenerateToken } from '../../application/use-cases/generateToken';
import { ValidateToken } from '../../application/use-cases/validateToken';
import { GenerateTokenDTO } from '../../application/dtos/generateTokenDTO';
import { ValidateTokenDTO } from '../../application/dtos/validateTokenDTO';

export class TokenController {
    constructor(private readonly generateToken: GenerateToken, private readonly validateToken: ValidateToken) {}

    async handleTokenGeneration(req: Request, res: Response): Promise<void> {
        try {
            const { contactId, phoneNumber, email, notificationPreference } = req.body;
            await this.generateToken.execute(contactId, phoneNumber, email, notificationPreference);
            res.status(200).send({ message: 'Token generated and sent successfully' });
        } catch (error) {
            console.error('Error generating and sending token:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error generating and sending token';
            res.status(400).send({ error: errorMessage });
        }
    }

    async handleTokenValidation(req: Request, res: Response): Promise<void> {
        try {
            const data = ValidateTokenDTO.validate({ ...req.params, ...req.body });
            await this.validateToken.execute(data.userId, data.tokenValue);
            res.status(200).send({ message: 'Token validated successfully' });
        } catch (error) {
            console.error('Error validating token:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error validating token';
            res.status(400).send({ error: errorMessage });
        }
    }
}
