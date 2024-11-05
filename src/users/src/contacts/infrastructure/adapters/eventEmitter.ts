import amqp from 'amqplib';
import { EventPublisher } from '../../domain/ports/EventPublisher';

export class EventEmitter implements EventPublisher {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    async connect(): Promise<void> {
        this.connection = await amqp.connect('amqp://localhost');
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange('contactExchange', 'topic', { durable: true });
    }

    async emit(routingKey: string, message: object): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel not initialized');
        }
        const msgBuffer = Buffer.from(JSON.stringify(message));
        this.channel.publish('contactExchange', routingKey, msgBuffer);
        console.log(`Message sent to ${routingKey}:`, message);
    }
}
