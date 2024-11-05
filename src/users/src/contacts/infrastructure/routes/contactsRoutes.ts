import { Router } from 'express';
import { initializeContactsController } from '../depedencies';

export const contactsRouter: Router = Router();

(async () => {
    const contactsController = await initializeContactsController();
    contactsRouter.post('/', contactsController.create.bind(contactsController));
})();
