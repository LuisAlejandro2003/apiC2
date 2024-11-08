import { PaymentRepository } from '../../domain/ports/PaymentRepository';
import { Payment } from '../../domain/entities/payment';

export class GetAllPayments {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(): Promise<Payment[]> {
        return await this.paymentRepository.findAll();
    }
}
