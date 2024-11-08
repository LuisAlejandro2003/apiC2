import { PaymentGateway } from '../../domain/ports/PaymentGateway';

export class CreatePaymentOrder {
    constructor(private readonly paymentGateway: PaymentGateway) {}

    async execute(paymentDetails: any): Promise<string> {
        return await this.paymentGateway.createOrder(paymentDetails);
    }
}
