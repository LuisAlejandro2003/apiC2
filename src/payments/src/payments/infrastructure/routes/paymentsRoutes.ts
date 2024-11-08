import { Router, Request, Response } from 'express';
import { initializeDependencies } from '../dependencies';
import { PaymentsController } from '../controllers/paymentsController'; // Importa el controlador

const router = Router();

initializeDependencies().then(({ createPayment, getAllPayments, getPaymentById, deletePaymentById }) => {
    const controller = new PaymentsController(createPayment, getAllPayments, getPaymentById, deletePaymentById);

    router.post('/', (req: Request, res: Response) => controller.create(req, res));
    router.get('/', (req: Request, res: Response) => controller.getAll(req, res));
    router.get('/:id', (req: Request, res: Response) => controller.getById(req, res));
    router.delete('/:id', (req: Request, res: Response) => controller.deleteById(req, res));
});

export { router as paymentsRouter };
