import { Request, Response } from 'express';
import { CreateUsers } from '../../application/use-cases/createUsers';
import { GetAllUsers } from '../../application/use-cases/getAllUsers';
import { GetUserById } from '../../application/use-cases/getUserById';
import { DeleteUserById } from '../../application/use-cases/deleteUserById';

export class UsersController {
    constructor(
        private createUsers: CreateUsers,
        private getAllUsers: GetAllUsers,
        private getUserById: GetUserById,
        private deleteUserById: DeleteUserById
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { email, password , notificationPreference  } = req.body;
            if (!email || !password) {
                res.status(400).send({ message: 'Email and password are required' });
                return;
            }

            await this.createUsers.execute({ email, password , notificationPreference});
            res.status(201).send({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send({ message: 'Failed to create user', error });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.getAllUsers.execute();
            res.status(200).send(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send({ message: 'Failed to fetch users', error });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const user = await this.getUserById.execute(userId);
            if (!user) {
                res.status(404).send({ message: 'User not found' });
                return;
            }
            res.status(200).send(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send({ message: 'Failed to fetch user', error });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            await this.deleteUserById.execute(userId);
            res.status(200).send({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send({ message: 'Failed to delete user', error });
        }
    }
}
