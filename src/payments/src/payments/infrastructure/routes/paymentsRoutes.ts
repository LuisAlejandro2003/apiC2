import { Router, Request, Response } from 'express';
import { initializeDependencies } from '../dependencies';

const router = Router();

initializeDependencies().then(({ createPayment }) => {
    router.post('/', async (req: Request, res: Response) => {
        // En tu método `execute` o en la ruta de `paymentsRoutes.ts`
console.log('Request received:', req.body);
try {
    const approvalUrl = await createPayment.execute(req.body);
    console.log('Approval URL:', approvalUrl);
    res.status(201).json({ approvalUrl });
} catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: error || 'Internal Server Error' });
}
    });
});

export { router as paymentsRouter };
