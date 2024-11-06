// src/payments/domain/entities/payment.ts
import { PaymentStatus } from '../value-objects/paymentStatus';

export class Payment {
    constructor(
        public readonly uuid: string,
        public readonly title: string,
        public readonly emailUser: string,
        public readonly amount: number,
        public readonly productId: string,
        public readonly externalReference: string,
        public readonly successUrl: string,
        public readonly failureUrl: string,
        public readonly approvalUrl: string,
        public status: PaymentStatus
    ) {}
}
