// src/payments/application/use-cases/createPayment.ts
import { PaymentRepository } from '../../domain/ports/PaymentRepository';
import { EventPublisher } from '../../domain/ports/EventPublisher';
import { Payment } from '../../domain/entities/payment';
import { v4 as uuidv4 } from 'uuid'; // Importa la función para generar UUID
import { PaymentStatus } from '../../domain/value-objects/paymentStatus';
import { getPayPalClient } from '../../infrastructure/adapters/paypalClient';
import * as paypal from '@paypal/checkout-server-sdk';

export class CreatePayment {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(paymentDetails: Omit<Payment, 'uuid' | 'approvalUrl'>): Promise<string> {
        const generatedUuid = uuidv4(); // Genera el UUID
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: paymentDetails.amount.toFixed(2),
                    },
                    description: paymentDetails.title,
                    custom_id: paymentDetails.productId,
                },
            ],
            application_context: {
                brand_name: 'My Payment App',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                return_url: paymentDetails.successUrl,
                cancel_url: paymentDetails.failureUrl,
            },
        });

        const response = await getPayPalClient().execute(request);
        const approvalLink = response.result.links?.find((link: { rel: string; }) => link.rel === 'approve')?.href;

        if (!approvalLink) {
            throw new Error('Approval link not found in PayPal response');
        }

        // Crea una nueva instancia de Payment con el UUID generado
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

        // Guarda el pago en la base de datos
        await this.paymentRepository.save(payment);

        // Emitir el evento de creación de pago
        await this.eventPublisher.publish('payment.created', {
            email: paymentDetails.emailUser,
            amount: paymentDetails.amount,
            approvalUrl: approvalLink,
            contactId: payment.contactId 
        });

        return approvalLink;
    }
}
