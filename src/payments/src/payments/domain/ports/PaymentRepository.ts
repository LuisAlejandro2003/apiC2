import { Payment } from '../entities/payment';

export interface PaymentRepository {
    save(payment: Payment): Promise<void>;
    findById(uuid: string): Promise<Payment | null>;
    findAll(): Promise<Payment[]>;
    deleteById(uuid: string): Promise<void>; 
}
