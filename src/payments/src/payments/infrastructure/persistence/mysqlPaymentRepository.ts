// src/payments/infrastructure/persistence/mysqlPaymentRepository.ts
import { PaymentRepository } from '../../domain/ports/PaymentRepository';
import { Payment } from '../../domain/entities/payment';
import { Pool } from 'mysql2/promise';

export class MysqlPaymentRepository implements PaymentRepository {
    constructor(private readonly db: Pool) {}

    async save(payment: Payment): Promise<void> {
        const query = `
            INSERT INTO Payments (uuid, title, emailUser, amount, productId, externalReference, successUrl, failureUrl, approvalUrl, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            payment.uuid,
            payment.title,
            payment.emailUser,
            payment.amount,
            payment.productId,
            payment.externalReference,
            payment.successUrl,
            payment.failureUrl,
            payment.approvalUrl,
            payment.status,
        ];

        // Reemplaza los valores `undefined` con `null`
        const sanitizedValues = values.map(value => value !== undefined ? value : null);

        // Log para verificar qué valores se están enviando
        console.log('Values being inserted:', sanitizedValues);

        await this.db.execute(query, sanitizedValues);
    }

    async findById(uuid: string): Promise<Payment | null> {
        const [rows]: any = await this.db.query('SELECT * FROM Payments WHERE uuid = ?', [uuid]);
        if (rows.length === 0) return null;

        const row = rows[0];
        return new Payment(
            row.uuid,
            row.title,
            row.emailUser,
            row.amount,
            row.productId,
            row.externalReference,
            row.successUrl,
            row.failureUrl,
            row.approvalUrl,
            row.status,
            row.contactId
        );
    }

    async findAll(): Promise<Payment[]> {
        const [rows]: any = await this.db.query('SELECT * FROM Payments');
        return rows.map((row: any) => new Payment(
            row.uuid,
            row.title,
            row.emailUser,
            row.amount,
            row.productId,
            row.externalReference,
            row.successUrl,
            row.failureUrl,
            row.approvalUrl,
            row.status,
            row.contactId
        ));
    }


    async deleteById(uuid: string): Promise<void> {
        const query = 'DELETE FROM Payments WHERE uuid = ?';
        await this.db.execute(query, [uuid]);
    }

}

