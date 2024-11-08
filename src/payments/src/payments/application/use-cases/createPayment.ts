import { v4 as uuidv4 } from 'uuid';
import { PaymentStatus } from '../../domain/value-objects/paymentStatus';
import { Payment } from '../../domain/entities/payment';
import { CreatePaymentOrder } from './createPaymentOrder';
import { StorePayment } from './storePayment';

export class CreatePayment {
    constructor(
        private readonly createPaymentOrder: CreatePaymentOrder,
        private readonly storePayment: StorePayment
    ) {}

    async execute(paymentDetails: Omit<Payment, 'uuid' | 'approvalUrl'>): Promise<string> {
        const generatedUuid = uuidv4();
        const approvalLink = await this.createPaymentOrder.execute(paymentDetails);

        const payment = new Payment(
            generatedUuid,
            paymentDetails.title,
            paymentDetails.emailUser,
            paymentDetails.amount,
            paymentDetails.productId,
            paymentDetails.externalReference,
            paymentDetails.successUrl,
            paymentDetails.failureUrl,
            approvalLink,
            PaymentStatus.PENDIENTE,
            paymentDetails.contactId
        );

        await this.storePayment.execute(payment);

        return approvalLink;
    }
}
