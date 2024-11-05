import amqp from 'amqplib';
import { EventPublisher } from '../../domain/ports/EventPublisher';

export class EventEmitter implements EventPublisher {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    async connect(): Promise<void> {
        this.connection = await amqp.connect('amqp://localhost:5672');
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue('user.created', { durable: true });
    }

    async emit(event: string, payload: any): Promise<void> {
        if (!this.channel) {
            throw new Error('Connection to RabbitMQ not established');
        }
        this.channel.sendToQueue(event, Buffer.from(JSON.stringify(payload)));
        console.log(`Event sent to ${event}:`, payload);
    }
}
