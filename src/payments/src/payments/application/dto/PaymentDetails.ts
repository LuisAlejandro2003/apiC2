// src/payments/application/dto/PaymentDetails.ts

export interface PaymentDetails {
    title: string;
    emailUser: string;
    amount: number;
    productId: string;
    externalReference: string;
    successUrl: string;
    failureUrl: string;
    contactId: string;
    notificationPreference?: string;
    phoneNumber?: string;
}
