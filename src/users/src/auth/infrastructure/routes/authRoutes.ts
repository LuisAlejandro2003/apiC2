import { Router } from 'express';
import { initializeAuthDependencies } from '../dependencies';

const router = Router();

initializeAuthDependencies().then((authController) => {
    router.post('/login', (req, res) => authController.loginUser(req, res));
});

export { router as authRouter };
