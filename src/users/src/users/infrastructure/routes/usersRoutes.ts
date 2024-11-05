import { Router } from 'express';
import { initializeUsersDependencies } from '../dependencies';

export const usersRouter: Router = Router();

(async () => {
    const usersController = await initializeUsersDependencies();

    usersRouter.post('/', usersController.create.bind(usersController));
})();
