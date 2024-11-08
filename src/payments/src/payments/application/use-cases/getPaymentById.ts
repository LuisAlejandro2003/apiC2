import { PaymentRepository } from '../../domain/ports/PaymentRepository';
import { Payment } from '../../domain/entities/payment';

export class GetPaymentById {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(paymentId: string): Promise<Payment | null> {
        return await this.paymentRepository.findById(paymentId);
    }
}
