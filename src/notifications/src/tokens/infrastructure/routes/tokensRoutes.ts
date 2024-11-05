import { Router } from 'express';
import { initializeTokenDependencies } from '../dependencies';

export const tokensRouter: Router = Router();

(async () => {
    const { tokenController } = await initializeTokenDependencies();

    // Define las rutas
    tokensRouter.post('/generate', tokenController.handleTokenGeneration.bind(tokenController));
    tokensRouter.post('/validate/:userId', tokenController.handleTokenValidation.bind(tokenController));
})();
