import * as paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

function getPayPalEnvironment() {
    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
    if (process.env.PAYPAL_ENVIRONMENT === 'sandbox') {
        return new paypal.core.SandboxEnvironment(clientId, clientSecret);
    }
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
}

export function getPayPalClient() {
    return new paypal.core.PayPalHttpClient(getPayPalEnvironment());
}
