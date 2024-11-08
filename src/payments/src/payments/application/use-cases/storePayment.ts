import { PaymentRepository } from '../../domain/ports/PaymentRepository';
import { EventPublisher } from '../../domain/ports/EventPublisher';
import { Payment } from '../../domain/entities/payment';

export class StorePayment {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(payment: Payment): Promise<void> {
        await this.paymentRepository.save(payment);
        await this.eventPublisher.publish('payment.created', {
            email: payment.emailUser,
            amount: payment.amount,
            approvalUrl: payment.approvalUrl,
            contactId: payment.contactId 
        });
    }
}