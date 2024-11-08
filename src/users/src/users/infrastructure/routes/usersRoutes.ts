import { Router } from 'express';
import { initializeUsersDependencies } from '../dependencies';

export const usersRouter: Router = Router();

(async () => {
    const usersController = await initializeUsersDependencies();

    usersRouter.post('/', usersController.create.bind(usersController));
    usersRouter.get('/', usersController.getAll.bind(usersController));
    usersRouter.get('/:userId', usersController.getById.bind(usersController));
    usersRouter.delete('/:userId', usersController.delete.bind(usersController));
})();