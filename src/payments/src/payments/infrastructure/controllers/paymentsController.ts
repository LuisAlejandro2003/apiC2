// paymentsController.ts
import { Request, Response } from 'express';
import { CreatePayment } from '../../application/use-cases/createPayment';
import { GetAllPayments } from '../../application/use-cases/getAllPayments';
import { GetPaymentById } from '../../application/use-cases/getPaymentById';
import { DeletePaymentById } from '../../application/use-cases/deletePaymentById';
import { PaymentDetails } from '../../application/dto/PaymentDetails';

export class PaymentsController {
    constructor(
        private readonly createPayment: CreatePayment,
        private readonly getAllPayments: GetAllPayments,
        private readonly getPaymentById: GetPaymentById,
        private readonly deletePaymentById: DeletePaymentById
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const {
                title,
                emailUser,
                amount,
                productId,
                externalReference,
                successUrl,
                failureUrl,
                contactId,
                notificationPreference,
                phoneNumber
            } = req.body;

            const paymentDetails: PaymentDetails = {
                title,
                emailUser,
                amount,
                productId,
                externalReference,
                successUrl,
                failureUrl,
                contactId,
                notificationPreference,
                phoneNumber
            };

            const approvalUrl = await this.createPayment.execute(paymentDetails);

            res.status(201).json({ approvalUrl });
        } catch (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const payments = await this.getAllPayments.execute();
            res.status(200).json(payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const payment = await this.getPaymentById.execute(req.params.id);
            if (!payment) {
                res.status(404).json({ message: 'Payment not found' });
                return;
            }
            res.status(200).json(payment);
        } catch (error) {
            console.error('Error fetching payment:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async deleteById(req: Request, res: Response): Promise<void> {
        try {
            await this.deletePaymentById.execute(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting payment:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
