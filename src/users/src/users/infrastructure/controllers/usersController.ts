import { Request, Response } from 'express';
import { CreateUsers } from '../../application/use-cases/createUsers';

export class UsersController {
    constructor(private createUsers: CreateUsers) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).send({ message: 'Email and password are required' });
                return;
            }

            await this.createUsers.execute({ email, password });
            res.status(201).send({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send({ message: 'Failed to create user', error });
        }
    }
}