// src/payments/ports/EventPublisher.ts
export interface EventPublisher {
    publish(event: string, data: any): Promise<void>;
}
