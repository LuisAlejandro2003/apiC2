// src/payments/infrastructure/controllers/paymentsController.ts
import { Request, Response } from 'express';
import { CreatePayment } from '../../application/use-cases/createPayment';

export class PaymentsController {
    constructor(private readonly createPayment: CreatePayment) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            await this.createPayment.execute(req.body);
            res.status(201).json({ message: 'Payment created successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}
