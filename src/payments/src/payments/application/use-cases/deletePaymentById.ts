import { PaymentRepository } from '../../domain/ports/PaymentRepository';

export class DeletePaymentById {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(paymentId: string): Promise<void> {
        await this.paymentRepository.deleteById(paymentId);
    }
}
