import { PaymentGateway } from '../../domain/ports/PaymentGateway';
import * as paypal from '@paypal/checkout-server-sdk';
import { getPayPalClient } from './paypalClient';

export class PayPalGateway implements PaymentGateway {
    async createOrder(paymentDetails: any): Promise<string> {
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

        return approvalLink;
    }
}
