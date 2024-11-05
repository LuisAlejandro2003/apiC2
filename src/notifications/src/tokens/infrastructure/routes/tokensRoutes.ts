import { Router } from 'express';
import { initializeTokenDependencies } from '../dependencies';

export const tokensRouter: Router = Router();

(async () => {
    const { tokenController } = await initializeTokenDependencies();

    // Define la ruta para manejar la generación de tokens
    tokensRouter.post('/generate', tokenController.handleTokenGeneration.bind(tokenController));
})();
