export interface PaymentGateway {
    createOrder(paymentDetails: any): Promise<string>;
}
