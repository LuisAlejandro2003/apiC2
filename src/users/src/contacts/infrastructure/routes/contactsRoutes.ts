import { Router } from 'express';
import { initializeContactsDependencies } from '../depedencies';

export const contactsRouter: Router = Router();

(async () => {
    const contactsController = await initializeContactsDependencies();

    contactsRouter.post('/', contactsController.create.bind(contactsController));
    contactsRouter.post('/findByEmail', contactsController.findByEmail.bind(contactsController)); 
    contactsRouter.get('/', contactsController.findAll.bind(contactsController));
    contactsRouter.put('/:uuid', contactsController.update.bind(contactsController));
    contactsRouter.delete('/:uuid', contactsController.delete.bind(contactsController));
})();
