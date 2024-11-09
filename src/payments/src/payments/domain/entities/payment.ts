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
        public status: PaymentStatus,
        public readonly contactId: string,
        public readonly notificationPreference?: string,
        public readonly phoneNumber?: string // Agregar phoneNumber como opcional
    ) {}

    markAsPaid() {
        if (this.status !== PaymentStatus.PENDIENTE) {
            throw new Error('Payment can only be marked as paid if it is pending');
        }
        this.status = PaymentStatus.PAGADO;
    }

    cancel() {
        if (this.status !== PaymentStatus.PENDIENTE) {
            throw new Error('Only pending payments can be cancelled');
        }
        this.status = PaymentStatus.CANCELADO;
    }
}
